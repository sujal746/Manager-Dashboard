import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import multer from 'multer';
import { fileURLToPath } from 'node:url';
import { getDatabase, hashPassword, initDatabase, newId, persistDatabase, safePublicUser, verifyPassword } from './db.js';

const app = express();
const port = Number(process.env.PORT || 3001);
const isProduction = process.env.NODE_ENV === 'production';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const collections = new Set(['team', 'tasks', 'events', 'projects', 'reviews', 'workLogs', 'leaves', 'issues', 'followUps', 'notes', 'meetings']);
const uploadsDir = path.join(process.env.DATA_DIR || path.join(__dirname, '..', 'data'), 'uploads');
const blockedUploadExtensions = new Set(['.exe', '.dll', '.bat', '.cmd', '.com', '.js', '.mjs', '.cjs', '.html', '.htm', '.svg', '.php', '.sh', '.jar', '.ps1', '.vbs']);
const attachmentStorage = multer.diskStorage({
  destination: (_req, _file, callback) => fs.mkdir(uploadsDir, { recursive: true, mode: 0o700 }, (error) => callback(error, uploadsDir)),
  filename: (_req, _file, callback) => callback(null, crypto.randomUUID()),
});
const attachmentUpload = multer({
  storage: attachmentStorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    if (blockedUploadExtensions.has(extension)) return callback(new Error('This file type is not allowed.'));
    callback(null, true);
  },
});
const sessionStore = new Map();
const loginAttempts = new Map();
const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000;
const COOKIE_NAME = 'manager_session';

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});
app.use(express.json({ limit: '1mb' }));

function parseCookies(header = '') {
  return header.split(';').reduce((result, pair) => {
    const index = pair.indexOf('=');
    if (index < 0) return result;
    const key = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    try { result[key] = decodeURIComponent(value); } catch { result[key] = value; }
    return result;
  }, {});
}

function setSessionCookie(res, token) {
  const pieces = [`${COOKIE_NAME}=${encodeURIComponent(token)}`, 'Path=/', 'HttpOnly', 'SameSite=Strict', `Max-Age=${Math.floor(SESSION_MAX_AGE_MS / 1000)}`];
  if (isProduction) pieces.push('Secure');
  res.setHeader('Set-Cookie', pieces.join('; '));
}

function clearSessionCookie(res) {
  const pieces = [`${COOKIE_NAME}=`, 'Path=/', 'HttpOnly', 'SameSite=Strict', 'Max-Age=0'];
  if (isProduction) pieces.push('Secure');
  res.setHeader('Set-Cookie', pieces.join('; '));
}

function requireManager(req, res, next) {
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  const session = token && sessionStore.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    if (token) sessionStore.delete(token);
    return res.status(401).json({ error: 'Please sign in to continue.' });
  }
  const user = getDatabase().users.find((candidate) => candidate.id === session.userId && candidate.role === 'manager');
  if (!user) {
    sessionStore.delete(token);
    clearSessionCookie(res);
    return res.status(401).json({ error: 'Please sign in to continue.' });
  }
  req.manager = user;
  req.sessionToken = token;
  session.expiresAt = Date.now() + SESSION_MAX_AGE_MS;
  return next();
}

function escapeText(value) {
  return String(value ?? '').replace(/[<>]/g, '').trim().slice(0, 5000);
}

function nameFor(personId, team) {
  return team.find((person) => person.id === personId)?.name || 'a team member';
}

function recordTitle(collection, item) {
  const titleKeys = {
    team: 'name', tasks: 'taskName', events: 'eventName', projects: 'projectName', reviews: 'periodLabel', workLogs: 'workCompleted',
    leaves: 'reason', issues: 'issue', followUps: 'followUp', notes: 'title', meetings: 'meetingName',
  };
  return escapeText(item?.[titleKeys[collection]] || item?.name || collection);
}

function humanValue(value) {
  if (value == null || value === '') return '—';
  if (Array.isArray(value)) return value.length ? value.map((entry) => typeof entry === 'object' ? entry.text || entry.name || '' : entry).filter(Boolean).join(', ') : '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function logActivity({ collection, item, action, before, after, message }) {
  const db = getDatabase();
  const now = new Date().toISOString();
  const oldValue = {};
  const newValue = {};
  if (before && after) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    for (const key of keys) {
      if (['updatedAt', 'history', 'revisions', 'createdAt'].includes(key)) continue;
      if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
        oldValue[key] = before[key] ?? null;
        newValue[key] = after[key] ?? null;
      }
    }
  }
  const defaultMessage = action === 'created'
    ? `New ${collection === 'team' ? 'team member' : collection.slice(0, -1)} added: ${recordTitle(collection, item)}`
    : action === 'archived'
      ? `${recordTitle(collection, item)} was archived`
      : `${recordTitle(collection, item)} updated`;
  const entry = { id: newId('audit'), actor: 'Manager', entityType: collection, entityId: item.id, action, details: message || defaultMessage, oldValue: before ? oldValue : null, newValue: after ? newValue : null, timestamp: now };
  db.audit.unshift(entry);
  db.activity.unshift({ id: newId('activity'), message: message || defaultMessage, actor: 'Manager', timestamp: now, entityType: collection, entityId: item.id });
  db.audit = db.audit.slice(0, 5000);
  db.activity = db.activity.slice(0, 3000);
}

function validateRecord(collection, item, existing = null) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return 'Record must be an object.';
  const value = { ...existing, ...item };
  if (collection === 'team') {
    if (!escapeText(value.name)) return 'A team member name is required.';
    if (!['Active', 'Offline'].includes(value.status || 'Active')) return 'Team status must be Active or Offline.';
    const departments = ['Moderation', 'Content', 'BD', 'Shiller', 'Creative', 'Research / Analyst', 'Other'];
    if (!departments.includes(value.department)) return 'Choose a supported department.';
    const roles = {
      Moderation: ['Moderator', 'Regional Mod', 'Mod Lead'], Content: ['Content'], BD: ['BD'], Shiller: ['Shiller'], Creative: ['Creative'], 'Research / Analyst': ['Research / Analyst'],
    };
    if (value.department !== 'Other' && !roles[value.department]?.includes(value.role)) return 'Choose a role that belongs to the selected department.';
    if (value.department === 'Other' && !escapeText(value.role)) return 'Enter a custom role for Other.';
  }
  if (collection === 'tasks') {
    if (!escapeText(value.taskName)) return 'A task name is required.';
    if (!['To Do', 'In Progress', 'In Review', 'Done'].includes(value.status || 'To Do')) return 'Choose a valid task status.';
    if (!['Low', 'Medium', 'High', 'Urgent'].includes(value.priority || 'Medium')) return 'Choose a valid priority.';
    const progress = Number(value.progress ?? 0);
    if (!Number.isFinite(progress) || progress < 0 || progress > 100) return 'Progress must be between 0 and 100.';
  }
  if (collection === 'events') {
    if (!escapeText(value.eventName)) return 'An event name is required.';
    if (!['Scheduled', 'In Progress', 'Completed', 'Cancelled'].includes(value.status || 'Scheduled')) return 'Choose a valid event status.';
  }
  if (collection === 'issues' && !['Open', 'Resolved'].includes(value.status || 'Open')) return 'Issue status must be Open or Resolved.';
  if (collection === 'followUps' && !['Pending', 'Completed'].includes(value.status || 'Pending')) return 'Follow-up status must be Pending or Completed.';
  if (collection === 'projects' && !escapeText(value.projectName)) return 'A project name is required.';
  if (collection === 'meetings' && !escapeText(value.meetingName)) return 'A meeting name is required.';
  if (collection === 'notes' && !escapeText(value.title)) return 'A note title is required.';
  if (collection === 'reviews') {
    const score = Number(value.overallScore);
    const rating = Number(value.managerRating);
    if (!value.personId || !Number.isFinite(score) || score < 0 || score > 100 || !Number.isFinite(rating) || rating < 1 || rating > 5) return 'Select a team member and enter a score from 0 to 100 and rating from 1 to 5.';
  }
  if (collection === 'leaves' && !value.personId) return 'Choose a team member for this leave record.';
  return null;
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/auth/login', async (req, res) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  if (attempt && attempt.lockedUntil > now) return res.status(429).json({ error: 'Too many sign-in attempts. Try again in a few minutes.' });
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const user = getDatabase().users.find((candidate) => candidate.email.toLowerCase() === email && candidate.role === 'manager');
  const valid = Boolean(user && verifyPassword(password, user.passwordHash));
  if (!valid) {
    const next = attempt && now - attempt.firstAttempt < 15 * 60_000 ? attempt : { count: 0, firstAttempt: now };
    next.count += 1;
    if (next.count >= 5) next.lockedUntil = now + 15 * 60_000;
    loginAttempts.set(ip, next);
    return res.status(401).json({ error: 'Email or password was not recognized.' });
  }
  loginAttempts.delete(ip);
  const token = crypto.randomBytes(32).toString('base64url');
  sessionStore.set(token, { userId: user.id, expiresAt: now + SESSION_MAX_AGE_MS });
  setSessionCookie(res, token);
  return res.json({ authenticated: true, user: safePublicUser(user) });
});

app.post('/api/auth/logout', (req, res) => {
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (token) sessionStore.delete(token);
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  const session = token && sessionStore.get(token);
  const user = session && session.expiresAt > Date.now() ? getDatabase().users.find((candidate) => candidate.id === session.userId) : null;
  if (!user) return res.status(401).json({ error: 'Please sign in.' });
  session.expiresAt = Date.now() + SESSION_MAX_AGE_MS;
  res.json({ authenticated: true, user: safePublicUser(user) });
});

app.post('/api/files', requireManager, attachmentUpload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Choose a file to upload.' });
  const name = path.basename(String(req.file.originalname || 'attachment')).replace(/[^a-zA-Z0-9 ._()-]/g, '_').slice(0, 180) || 'attachment';
  const attachment = { id: req.file.filename, name, size: req.file.size, mimeType: 'application/octet-stream', uploadedAt: new Date().toISOString() };
  const db = getDatabase();
  if (!Array.isArray(db.attachments)) db.attachments = [];
  db.attachments.unshift(attachment);
  await fs.promises.chmod(req.file.path, 0o600);
  logActivity({ collection: 'attachments', item: attachment, action: 'created', message: `Manager uploaded attachment: ${name}` });
  await persistDatabase();
  res.status(201).json({ attachment });
});

app.get('/api/files/:id', requireManager, (req, res) => {
  const attachment = (getDatabase().attachments || []).find((item) => item.id === req.params.id);
  if (!attachment || !/^[0-9a-f-]{36}$/i.test(attachment.id)) return res.status(404).json({ error: 'Attachment not found.' });
  const filePath = path.join(uploadsDir, attachment.id);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Attachment file is unavailable.' });
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.download(filePath, attachment.name, (error) => {
    if (error && !res.headersSent) res.status(404).json({ error: 'Unable to download this attachment.' });
  });
});

app.post('/api/auth/change-password', requireManager, async (req, res) => {
  const currentPassword = String(req.body?.currentPassword || '');
  const newPassword = String(req.body?.newPassword || '');
  if (!verifyPassword(currentPassword, req.manager.passwordHash)) return res.status(400).json({ error: 'Current password is incorrect.' });
  if (newPassword.length < 12) return res.status(400).json({ error: 'Use a new password with at least 12 characters.' });
  if (newPassword.length > 200) return res.status(400).json({ error: 'Password is too long.' });
  req.manager.passwordHash = hashPassword(newPassword);
  req.manager.mustChangePassword = false;
  for (const [token, session] of sessionStore.entries()) {
    if (session.userId === req.manager.id && token !== req.sessionToken) sessionStore.delete(token);
  }
  logActivity({ collection: 'settings', item: { id: req.manager.id, name: 'Manager password' }, action: 'updated', message: 'Manager password was changed' });
  await persistDatabase();
  res.json({ ok: true, user: safePublicUser(req.manager) });
});

app.post('/api/managers', requireManager, async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Enter a valid manager email address.' });
  if (password.length < 12) return res.status(400).json({ error: 'Manager passwords must be at least 12 characters.' });
  if (password.length > 200) return res.status(400).json({ error: 'Password is too long.' });
  const db = getDatabase();
  if (db.users.some((user) => user.email.toLowerCase() === email)) return res.status(409).json({ error: 'A manager account with that email already exists.' });
  const passwordHash = hashPassword(password);
  const manager = { id: newId('manager'), email, passwordHash, role: 'manager', mustChangePassword: false, createdAt: new Date().toISOString() };
  db.users.push(manager);
  logActivity({ collection: 'settings', item: { id: manager.id, name: 'Manager account' }, action: 'created', message: 'A Manager account was created' });
  await persistDatabase();
  return res.status(201).json({ created: true });
});

app.get('/api/records', requireManager, (_req, res) => {
  const db = getDatabase();
  const response = {};
  for (const collection of collections) response[collection] = db[collection].filter((record) => !record.archivedAt);
  response.activity = db.activity;
  response.audit = db.audit;
  res.json(response);
});

app.post('/api/records/:collection', requireManager, async (req, res) => {
  const { collection } = req.params;
  if (!collections.has(collection)) return res.status(404).json({ error: 'Unknown record type.' });
  const error = validateRecord(collection, req.body);
  if (error) return res.status(400).json({ error });
  const db = getDatabase();
  const item = { ...req.body, id: req.body.id || newId(collection.slice(0, -1)), createdAt: req.body.createdAt || new Date().toISOString() };
  delete item.archivedAt;
  if (collection === 'tasks') {
    item.progress = item.status === 'Done' ? 100 : Number(item.progress ?? 0);
    item.history = Array.isArray(item.history) ? item.history : [];
    const createdAt = new Date().toISOString();
    item.history.push({ id: newId('task-history'), message: 'Task created', timestamp: createdAt });
    if (item.assignedTo) item.history.push({ id: newId('task-history'), message: `Assigned to ${nameFor(item.assignedTo, db.team)}`, timestamp: createdAt });
    if (item.priority) item.history.push({ id: newId('task-history'), message: `Priority set to ${item.priority}`, timestamp: createdAt });
    if (item.dueDate) item.history.push({ id: newId('task-history'), message: `Due date set to ${item.dueDate}`, timestamp: createdAt });
    if (item.status === 'Done') item.history.push({ id: newId('task-history'), message: 'Task completed', timestamp: createdAt });
  }
  if (collection === 'reviews') item.revisions = [];
  if (collection === 'team') {
    item.status = item.status || 'Active';
    item.responsibilitiesHistory = Array.isArray(item.responsibilitiesHistory) ? item.responsibilitiesHistory : [];
    item.projects = Array.isArray(item.projects) ? item.projects : [];
    item.assignedMods = Array.isArray(item.assignedMods) ? item.assignedMods : [];
  }
  db[collection].unshift(item);
  let createMessage;
  if (collection === 'tasks' && item.assignedTo) createMessage = `New task assigned to ${nameFor(item.assignedTo, db.team)}: ${item.taskName}`;
  else if (collection === 'events') createMessage = `Event ${String(item.status || 'Scheduled').toLowerCase()}: ${item.eventName}`;
  else if (collection === 'reviews') createMessage = `Performance review completed for ${nameFor(item.personId, db.team)} · ${item.periodLabel}`;
  else if (collection === 'leaves') createMessage = `Leave record added for ${nameFor(item.personId, db.team)}`;
  else if (collection === 'workLogs') createMessage = `Daily work log recorded for ${nameFor(item.personId, db.team)}`;
  else if (collection === 'followUps') createMessage = `Follow-up added: ${item.followUp}`;
  else if (collection === 'meetings') createMessage = `Meeting scheduled: ${item.meetingName}`;
  logActivity({ collection, item, action: 'created', message: createMessage });
  if (collection === 'leaves' && !item.actualReturn) {
    const person = db.team.find((member) => member.id === item.personId);
    if (person && person.status !== 'Offline') {
      const beforePerson = structuredClone(person);
      person.status = 'Offline';
      person.updatedAt = new Date().toISOString();
      logActivity({ collection: 'team', item: person, action: 'updated', before: beforePerson, after: person, message: `Manager marked ${person.name} Offline for leave` });
    }
  }
  if (collection === 'reviews') {
    const person = db.team.find((member) => member.id === item.personId);
    if (person) {
      const beforePerson = structuredClone(person);
      person.currentScore = Number(item.overallScore);
      person.managerRating = Number(item.managerRating);
      person.updatedAt = new Date().toISOString();
      logActivity({ collection: 'team', item: person, action: 'updated', before: beforePerson, after: person, message: `Manager updated ${person.name}'s current performance score from ${beforePerson.currentScore ?? '—'} to ${person.currentScore}` });
    }
  }
  await persistDatabase();
  res.status(201).json(item);
});

app.patch('/api/records/:collection/:id', requireManager, async (req, res) => {
  const { collection, id } = req.params;
  if (!collections.has(collection)) return res.status(404).json({ error: 'Unknown record type.' });
  const db = getDatabase();
  const index = db[collection].findIndex((record) => record.id === id);
  if (index < 0) return res.status(404).json({ error: 'Record not found.' });
  const current = db[collection][index];
  const error = validateRecord(collection, req.body, current);
  if (error) return res.status(400).json({ error });
  const before = structuredClone(current);
  const next = { ...current, ...req.body, id: current.id, updatedAt: new Date().toISOString() };
  if (collection === 'tasks') {
    if (next.status === 'Done') next.progress = 100;
    const fields = ['taskName', 'description', 'assignedTo', 'department', 'role', 'priority', 'startDate', 'dueDate', 'relatedProject', 'relatedEvent', 'checklist', 'notes', 'attachments', 'status', 'progress'];
    const labels = { taskName: 'task name', description: 'description', assignedTo: 'assignee', department: 'department', role: 'role', priority: 'priority', startDate: 'start date', dueDate: 'deadline', relatedProject: 'related project', relatedEvent: 'related event', checklist: 'checklist', notes: 'notes', attachments: 'attachments', status: 'status', progress: 'progress' };
    for (const field of fields) {
      if (JSON.stringify(before[field]) !== JSON.stringify(next[field])) {
        const from = field === 'assignedTo' ? (before[field] ? nameFor(before[field], db.team) : 'Unassigned') : humanValue(before[field]);
        const to = field === 'assignedTo' ? (next[field] ? nameFor(next[field], db.team) : 'Unassigned') : humanValue(next[field]);
        next.history = [...(next.history || []), { id: newId('task-history'), message: `${labels[field]} changed from ${from} to ${to}`, timestamp: new Date().toISOString() }];
      }
    }
    if (before.status !== 'Done' && next.status === 'Done') next.history.push({ id: newId('task-history'), message: 'Task completed', timestamp: new Date().toISOString() });
  }
  if (collection === 'team') {
    const oldResponsibilities = [before.primaryResponsibility, before.secondaryResponsibility].filter(Boolean).join(' · ');
    const newResponsibilities = [next.primaryResponsibility, next.secondaryResponsibility].filter(Boolean).join(' · ');
    if (oldResponsibilities !== newResponsibilities && oldResponsibilities) {
      next.responsibilitiesHistory = [...(next.responsibilitiesHistory || []), { responsibilities: oldResponsibilities, changedAt: new Date().toISOString(), manager: 'Manager' }];
    }
  }
  if (collection === 'reviews') next.revisions = [...(current.revisions || []), { snapshot: before, revisedAt: new Date().toISOString() }];
  const validNext = validateRecord(collection, next, current);
  if (validNext) return res.status(400).json({ error: validNext });
  db[collection][index] = next;
  let message;
  if (collection === 'team' && before.role !== next.role) message = `Manager changed ${next.name}'s role from ${before.role} to ${next.role}`;
  else if (collection === 'team' && before.status !== next.status) message = `Manager changed ${next.name}'s status from ${before.status} to ${next.status}`;
  else if (collection === 'tasks' && before.status !== next.status && next.status === 'Done') message = `Task completed: ${next.taskName}`;
  else if (collection === 'tasks' && before.status !== next.status) message = `${next.taskName} moved from ${before.status} to ${next.status}`;
  else if (collection === 'tasks' && before.priority !== next.priority) message = `Priority changed for ${next.taskName}: ${before.priority} → ${next.priority}`;
  else if (collection === 'tasks' && before.progress !== next.progress) message = `Progress updated for ${next.taskName}: ${before.progress ?? 0}% → ${next.progress ?? 0}%`;
  else if (collection === 'tasks' && before.assignedTo !== next.assignedTo) message = `Task assigned to ${next.assignedTo ? nameFor(next.assignedTo, db.team) : 'Unassigned'}: ${next.taskName}`;
  else if (collection === 'tasks' && before.dueDate !== next.dueDate) message = `Manager changed task deadline for ${next.taskName} from ${before.dueDate || '—'} to ${next.dueDate || '—'}`;
  else if (collection === 'events' && before.status !== next.status && next.status === 'Completed') message = `Event completed: ${next.eventName}`;
  else if (collection === 'events' && before.status !== next.status) message = `Event ${next.status.toLowerCase()}: ${next.eventName}`;
  else if (collection === 'followUps' && before.status !== next.status) message = `Follow-up ${next.status.toLowerCase()}: ${next.followUp}`;
  else if (collection === 'leaves' && !before.actualReturn && next.actualReturn) message = `Leave ended for ${nameFor(next.personId, db.team)}; return recorded`;
  logActivity({ collection, item: next, action: 'updated', before, after: next, message });
  if (collection === 'leaves') {
    const person = db.team.find((member) => member.id === next.personId);
    if (person) {
      const beforePerson = structuredClone(person);
      const stillOnLeave = db.leaves.some((leave) => leave.id !== next.id && leave.personId === person.id && !leave.actualReturn);
      if (next.actualReturn && !stillOnLeave) person.status = 'Active';
      else if (!next.actualReturn) person.status = 'Offline';
      if (beforePerson.status !== person.status) {
        person.updatedAt = new Date().toISOString();
        logActivity({ collection: 'team', item: person, action: 'updated', before: beforePerson, after: person, message: `Manager changed ${person.name}'s status from ${beforePerson.status} to ${person.status}` });
      }
    }
  }
  if (collection === 'reviews') {
    const person = db.team.find((member) => member.id === next.personId);
    if (person) {
      const beforePerson = structuredClone(person);
      person.currentScore = Number(next.overallScore);
      person.managerRating = Number(next.managerRating);
      person.updatedAt = new Date().toISOString();
      logActivity({ collection: 'team', item: person, action: 'updated', before: beforePerson, after: person, message: `Manager updated ${person.name}'s current performance score from ${beforePerson.currentScore ?? '—'} to ${person.currentScore}` });
    }
  }
  await persistDatabase();
  res.json(next);
});

app.delete('/api/records/:collection/:id', requireManager, async (req, res) => {
  const { collection, id } = req.params;
  if (!collections.has(collection)) return res.status(404).json({ error: 'Unknown record type.' });
  const item = getDatabase()[collection].find((record) => record.id === id);
  if (!item) return res.status(404).json({ error: 'Record not found.' });
  item.archivedAt = new Date().toISOString();
  logActivity({ collection, item, action: 'archived' });
  await persistDatabase();
  res.json({ archived: true });
});

if (isProduction) {
  const dist = path.join(__dirname, '..', 'dist');
  app.use(express.static(dist, { index: false }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.use((error, _req, res, _next) => {
  const expectedUploadError = error instanceof multer.MulterError || error?.message === 'This file type is not allowed.';
  if (expectedUploadError) console.warn('Attachment upload rejected:', error.message);
  else console.error('Request error:', error?.stack || error);
  if (res.headersSent) return;
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Attachments must be 10 MB or smaller.' });
  if (expectedUploadError) return res.status(400).json({ error: error.message || 'Unable to upload this file.' });
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

await initDatabase();
app.listen(port, '0.0.0.0', () => {
  console.log(`Manager Control Center API listening on 0.0.0.0:${port}`);
});
