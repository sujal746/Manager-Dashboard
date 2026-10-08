import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DATA_DIR || path.join(here, '..', 'data');
const dataFile = path.join(dataDir, 'manager-control-center.json');

const ids = {
  kuldeep: 'person-kuldeep',
  alex: 'person-alex',
  jordan: 'person-jordan',
  john: 'person-john',
  sarah: 'person-sarah',
  mike: 'person-mike',
  david: 'person-david',
  ryan: 'person-ryan',
};
const daysFromNow = (amount) => {
  const date = new Date();
  date.setDate(date.getDate() + amount);
  return date.toISOString().slice(0, 10);
};
const timestamp = (offsetMinutes = 0) => new Date(Date.now() + offsetMinutes * 60_000).toISOString();

export function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, 64);
  return `${salt.toString('hex')}:${derived.toString('hex')}`;
}

export function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string' || !stored.includes(':')) return false;
  const [saltHex, hashHex] = stored.split(':');
  try {
    const expected = Buffer.from(hashHex, 'hex');
    const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

function makeSeed() {
  const team = [
    {
      id: ids.kuldeep, name: 'Kuldeep', username: '@kuldeep', department: 'Moderation', role: 'Mod Lead', status: 'Active', joined: '2026-09-01', manager: 'Manager', timezone: 'Asia/Kolkata', workingHours: '09:00–17:00 IST', currentWork: 'Discord Operations', currentScore: 92, managerRating: 4.5,
      primaryResponsibility: 'Moderation operations and team coordination', secondaryResponsibility: 'Escalations and quality reviews', projects: ['project-community-ops'], communities: ['Discord'], region: 'Global', language: 'English', assignedCommunity: 'Discord', coverageHours: '09:00–17:00 IST', assignedMods: [ids.alex, ids.jordan], responsibilitiesHistory: [], createdAt: timestamp(-20_000),
    },
    {
      id: ids.alex, name: 'Alex', username: '@alex', department: 'Moderation', role: 'Regional Mod', status: 'Active', joined: '2026-09-12', manager: 'Kuldeep', timezone: 'Asia/Singapore', workingHours: '10:00–18:00 SGT', currentWork: 'APAC Region', currentScore: 88, managerRating: 4,
      primaryResponsibility: 'APAC community coverage', secondaryResponsibility: 'Regional escalation response', projects: ['project-community-ops'], communities: ['Discord'], region: 'APAC', language: 'English', assignedCommunity: 'Discord', coverageHours: '10:00–18:00 SGT', assignedMods: [], responsibilitiesHistory: [], createdAt: timestamp(-18_000),
    },
    {
      id: ids.jordan, name: 'Jordan', username: '@jordan', department: 'Moderation', role: 'Moderator', status: 'Active', joined: '2026-09-18', manager: 'Kuldeep', timezone: 'Europe/London', workingHours: '12:00–20:00 BST', currentWork: 'Community queue and member support', currentScore: 86, managerRating: 4,
      primaryResponsibility: 'Daily moderation and member support', secondaryResponsibility: 'Flag and escalate policy issues', projects: ['project-community-ops'], communities: ['Discord'], region: '', language: 'English', assignedCommunity: 'Discord', coverageHours: '', assignedMods: [], responsibilitiesHistory: [], createdAt: timestamp(-16_000),
    },
    {
      id: ids.john, name: 'John', username: '@john', department: 'Shiller', role: 'Shiller', status: 'Offline', joined: '2026-09-20', manager: 'Manager', timezone: 'America/New_York', workingHours: 'Flexible', currentWork: '—', currentScore: 84, managerRating: 4,
      primaryResponsibility: 'Campaign distribution support', secondaryResponsibility: 'Partner amplification', projects: ['project-launch-campaign'], communities: [], region: '', language: 'English', assignedCommunity: '', coverageHours: '', assignedMods: [], responsibilitiesHistory: [], createdAt: timestamp(-14_000),
    },
    {
      id: ids.sarah, name: 'Sarah', username: '@sarah', department: 'Content', role: 'Content', status: 'Active', joined: '2026-08-05', manager: 'Manager', timezone: 'America/Los_Angeles', workingHours: '09:00–17:00 PT', currentWork: 'X Content', currentScore: 94, managerRating: 5,
      primaryResponsibility: 'Content planning and publishing', secondaryResponsibility: 'Campaign copy and reporting', projects: ['project-launch-campaign'], communities: ['X'], region: '', language: 'English', assignedCommunity: 'X', coverageHours: '', assignedMods: [], responsibilitiesHistory: [], createdAt: timestamp(-12_000),
    },
    {
      id: ids.mike, name: 'Mike', username: '@mike', department: 'BD', role: 'BD', status: 'Active', joined: '2026-08-10', manager: 'Manager', timezone: 'Europe/London', workingHours: '09:00–17:00 BST', currentWork: 'Partner Outreach', currentScore: 91, managerRating: 4.5,
      primaryResponsibility: 'Partner pipeline and outreach', secondaryResponsibility: 'Partnership meeting coordination', projects: ['project-launch-campaign'], communities: [], region: '', language: '', assignedCommunity: '', coverageHours: '', assignedMods: [], responsibilitiesHistory: [], createdAt: timestamp(-10_000),
    },
    {
      id: ids.david, name: 'David', username: '@david', department: 'Creative', role: 'Creative', status: 'Active', joined: '2026-09-02', manager: 'Manager', timezone: 'Asia/Kolkata', workingHours: '10:00–18:00 IST', currentWork: 'Campaign Creatives', currentScore: 90, managerRating: 4.5,
      primaryResponsibility: 'Campaign creative production', secondaryResponsibility: 'Brand asset maintenance', projects: ['project-launch-campaign'], communities: [], region: '', language: '', assignedCommunity: '', coverageHours: '', assignedMods: [], responsibilitiesHistory: [], createdAt: timestamp(-8_000),
    },
    {
      id: ids.ryan, name: 'Ryan', username: '@ryan', department: 'Research / Analyst', role: 'Research / Analyst', status: 'Active', joined: '2026-09-15', manager: 'Manager', timezone: 'America/New_York', workingHours: '09:00–17:00 ET', currentWork: 'Competitor Research', currentScore: 93, managerRating: 4.5,
      primaryResponsibility: 'Competitor and market research', secondaryResponsibility: 'Campaign analysis and reporting', projects: ['project-launch-campaign'], communities: [], region: '', language: '', assignedCommunity: '', coverageHours: '', assignedMods: [], responsibilitiesHistory: [], createdAt: timestamp(-6_000),
    },
  ];

  const tasks = [
    { id: 'task-weekly-report', taskName: 'Weekly Community Report', description: 'Prepare the weekly moderation and operations summary for manager review.', assignedTo: ids.alex, department: 'Moderation', role: 'Regional Mod', priority: 'High', startDate: daysFromNow(-3), dueDate: daysFromNow(1), relatedProject: 'project-community-ops', relatedEvent: '', checklist: [{ text: 'Gather regional notes', done: true }, { text: 'Review escalations', done: false }, { text: 'Submit summary', done: false }], notes: 'Include APAC coverage notes.', attachments: [], status: 'In Progress', progress: 70, history: [{ id: 'th-1', message: 'Task created', timestamp: timestamp(-9_000) }, { id: 'th-2', message: 'Progress updated to 70%', timestamp: timestamp(-2_000) }], createdAt: timestamp(-9_000) },
    { id: 'task-market-scan', taskName: 'Competitor Market Scan', description: 'Summarize the latest competitor campaign activity and opportunities.', assignedTo: ids.ryan, department: 'Research / Analyst', role: 'Research / Analyst', priority: 'Medium', startDate: daysFromNow(-1), dueDate: daysFromNow(3), relatedProject: 'project-launch-campaign', relatedEvent: '', checklist: [{ text: 'Review campaign pages', done: false }, { text: 'Summarize findings', done: false }], notes: '', attachments: [], status: 'To Do', progress: 0, history: [{ id: 'th-3', message: 'Task created', timestamp: timestamp(-6_000) }], createdAt: timestamp(-6_000) },
    { id: 'task-x-copy', taskName: 'Campaign announcement copy', description: 'Draft the first announcement and two reminder variations.', assignedTo: ids.sarah, department: 'Content', role: 'Content', priority: 'Urgent', startDate: daysFromNow(-4), dueDate: daysFromNow(0), relatedProject: 'project-launch-campaign', relatedEvent: 'event-team-kickoff', checklist: [{ text: 'Draft announcement', done: true }, { text: 'Review links and CTA', done: false }], notes: 'Coordinate with Creative before final.', attachments: [], status: 'In Review', progress: 90, history: [{ id: 'th-4', message: 'Task moved to In Review', timestamp: timestamp(-1_000) }], createdAt: timestamp(-5_000) },
    { id: 'task-partner-brief', taskName: 'Partner outreach brief', description: 'Prepare a concise brief for the next partner conversations.', assignedTo: ids.mike, department: 'BD', role: 'BD', priority: 'Low', startDate: daysFromNow(-8), dueDate: daysFromNow(-2), relatedProject: 'project-launch-campaign', relatedEvent: '', checklist: [], notes: '', attachments: [], status: 'Done', progress: 100, history: [{ id: 'th-5', message: 'Task completed', timestamp: timestamp(-3_000) }], createdAt: timestamp(-11_000) },
    { id: 'task-creative', taskName: 'Campaign visual concepts', description: 'Create three visual directions for the upcoming campaign.', assignedTo: ids.david, department: 'Creative', role: 'Creative', priority: 'High', startDate: daysFromNow(-1), dueDate: daysFromNow(2), relatedProject: 'project-launch-campaign', relatedEvent: 'event-team-kickoff', checklist: [{ text: 'Moodboard', done: true }, { text: 'First concepts', done: false }], notes: '', attachments: [], status: 'In Progress', progress: 45, history: [{ id: 'th-6', message: 'Task created', timestamp: timestamp(-4_000) }], createdAt: timestamp(-4_000) },
    { id: 'task-escalation-playbook', taskName: 'Refresh escalation playbook', description: 'Review escalation guidance and confirm current on-call handoffs.', assignedTo: ids.jordan, department: 'Moderation', role: 'Moderator', priority: 'Medium', startDate: daysFromNow(-2), dueDate: daysFromNow(5), relatedProject: 'project-community-ops', relatedEvent: '', checklist: [], notes: '', attachments: [], status: 'To Do', progress: 0, history: [{ id: 'th-7', message: 'Task created', timestamp: timestamp(-3_000) }], createdAt: timestamp(-3_000) },
  ];

  return {
    schemaVersion: 1,
    users: [],
    team,
    tasks,
    events: [
      {
        id: 'event-team-kickoff', eventName: 'Campaign team kickoff', eventType: 'Team Meeting', date: daysFromNow(1), startTime: '10:00', endTime: '10:45', timezone: 'UTC', organizer: 'Manager', assignedTeamMembers: [ids.sarah, ids.david, ids.mike, ids.ryan], department: 'Cross-team', platform: 'Google Meet', location: 'Team room', description: 'Align owners, timelines, and handoffs for the campaign.', objective: 'Confirm launch readiness and next actions.', preparationTasks: [{ text: 'Share brief', assignedTo: ids.mike, done: true }, { text: 'Bring creative concepts', assignedTo: ids.david, done: false }], status: 'Scheduled', notes: '', report: null, createdAt: timestamp(-5_000),
      },
      {
        id: 'event-mod-sync', eventName: 'Moderation weekly sync', eventType: 'Mod Meeting', date: daysFromNow(4), startTime: '16:00', endTime: '16:30', timezone: 'UTC', organizer: 'Kuldeep', assignedTeamMembers: [ids.kuldeep, ids.alex, ids.jordan], department: 'Moderation', platform: 'Discord', location: '#mod-team', description: 'Review open moderation actions and upcoming coverage.', objective: 'Close open loops and confirm weekly coverage.', preparationTasks: [{ text: 'Bring open issue list', assignedTo: ids.alex, done: false }], status: 'Scheduled', notes: '', report: null, createdAt: timestamp(-4_000),
      },
    ],
    projects: [
      { id: 'project-community-ops', projectName: 'Community operations', description: 'Maintain consistent coverage, escalation practices, and team handoffs.', startDate: daysFromNow(-14), deadline: daysFromNow(14), manager: 'Manager', teamMembers: [ids.kuldeep, ids.alex, ids.jordan], department: 'Moderation', status: 'In Progress', notes: 'Weekly review during the Mod sync.', createdAt: timestamp(-10_000) },
      { id: 'project-launch-campaign', projectName: 'October campaign', description: 'Coordinate research, partner outreach, content, and creative delivery.', startDate: daysFromNow(-10), deadline: daysFromNow(8), manager: 'Manager', teamMembers: [ids.john, ids.sarah, ids.mike, ids.david, ids.ryan], department: 'Cross-team', status: 'In Progress', notes: '', createdAt: timestamp(-9_000) },
    ],
    reviews: [
      { id: 'review-sarah-sep', personId: ids.sarah, reviewType: 'Monthly', periodLabel: 'September 2026', periodStart: '2026-09-01', periodEnd: '2026-09-30', metrics: { tasksAssigned: 4, tasksCompleted: 4, tasksPending: 0, overdueTasks: 0, completionRate: 100, projectsCompleted: 1, eventsSupported: 1, issuesHandled: 0, reportsSubmitted: 2 }, overallScore: 94, managerRating: 5, strengths: 'Clear, reliable campaign writing.', weaknesses: 'Can hold drafts too long before first review.', areasForImprovement: 'Share early drafts for faster feedback.', managerFeedback: 'Strong month with dependable delivery.', achievements: 'Delivered the campaign content pack ahead of schedule.', nextGoals: 'Own the October editorial plan.', additionalResponsibilities: 'Content calendar coordination', createdAt: timestamp(-2_000) },
      { id: 'review-alex-sep', personId: ids.alex, reviewType: 'Monthly', periodLabel: 'September 2026', periodStart: '2026-09-01', periodEnd: '2026-09-30', metrics: { tasksAssigned: 5, tasksCompleted: 4, tasksPending: 1, overdueTasks: 0, completionRate: 80, projectsCompleted: 0, eventsSupported: 2, issuesHandled: 3, reportsSubmitted: 2 }, overallScore: 88, managerRating: 4, strengths: 'Calm regional escalation handling.', weaknesses: 'Handoffs could include more context.', areasForImprovement: 'Use the shared handoff format.', managerFeedback: 'Reliable coverage and good judgment.', achievements: 'Resolved three regional escalations.', nextGoals: 'Improve handoff consistency.', additionalResponsibilities: '', createdAt: timestamp(-1_000) },
    ],
    workLogs: [
      { id: 'log-sarah-today', date: daysFromNow(0), personId: ids.sarah, department: 'Content', role: 'Content', workCompleted: 'Outlined campaign announcement and aligned the CTA.', tasksCompleted: ['task-partner-brief'], contributions: 'Flagged a launch dependency before final review.', problems: '', pendingWork: 'Finalize announcement after design review.', managerNotes: '', createdAt: timestamp(-600) },
      { id: 'log-alex-yesterday', date: daysFromNow(-1), personId: ids.alex, department: 'Moderation', role: 'Regional Mod', workCompleted: 'Reviewed APAC queue and documented two handoffs.', tasksCompleted: [], contributions: 'Closed a regional coverage gap.', problems: '', pendingWork: 'Finish weekly report.', managerNotes: '', createdAt: timestamp(-1_500) },
    ],
    leaves: [
      { id: 'leave-john-current', personId: ids.john, leaveStart: daysFromNow(-1), expectedReturn: daysFromNow(3), actualReturn: '', reason: 'Personal leave', managerNote: 'Coverage moved to the campaign rotation.', createdAt: timestamp(-2_500) },
    ],
    issues: [
      { id: 'issue-handoff', issue: 'Regional handoff details were incomplete', personId: ids.alex, department: 'Moderation', date: daysFromNow(-2), priority: 'Medium', description: 'A coverage handoff did not include the pending escalation owner.', actionTaken: 'Reviewed the shared handoff checklist with the regional team.', resolution: 'Checklist updated; monitoring next handoff.', followUp: 'Confirm the new format is used in the next weekly sync.', managerNotes: 'Coaching item, not a formal warning.', status: 'Open', createdAt: timestamp(-2_200) },
    ],
    followUps: [
      { id: 'followup-john', followUp: 'Review John’s campaign coverage after return', personId: ids.john, department: 'Shiller', relatedTask: '', relatedEvent: '', dueDate: daysFromNow(3), priority: 'Medium', notes: 'Check leave handoff and agree the next assignment.', status: 'Pending', createdAt: timestamp(-1_800) },
      { id: 'followup-review', followUp: 'Complete October check-ins', personId: '', department: 'All', relatedTask: '', relatedEvent: '', dueDate: daysFromNow(5), priority: 'Low', notes: 'Schedule a short 1-on-1 with each department lead.', status: 'Pending', createdAt: timestamp(-1_600) },
    ],
    notes: [
      { id: 'note-alex', title: 'Regional ownership', body: 'Alex handled the regional escalation very well. Consider assigning him more responsibility after the next review.', targetType: 'Person', targetId: ids.alex, department: 'Moderation', pinned: true, createdAt: timestamp(-1_200), updatedAt: timestamp(-1_200) },
    ],
    meetings: [
      { id: 'meeting-mod', meetingName: 'Mod leadership check-in', meetingType: 'Mod Meeting', date: daysFromNow(2), time: '15:00', participants: [ids.kuldeep, ids.alex], agenda: 'Regional coverage, open issue, next week planning.', notes: '', actionItems: [], followUpDate: '', createdAt: timestamp(-1_000) },
    ],
    activity: [
      { id: 'activity-seed-1', message: 'Campaign team kickoff was scheduled', actor: 'Manager', timestamp: timestamp(-300), entityType: 'event', entityId: 'event-team-kickoff' },
      { id: 'activity-seed-2', message: 'Campaign announcement copy moved to In Review', actor: 'Manager', timestamp: timestamp(-700), entityType: 'task', entityId: 'task-x-copy' },
      { id: 'activity-seed-3', message: 'John’s leave record was added', actor: 'Manager', timestamp: timestamp(-1_300), entityType: 'leave', entityId: 'leave-john-current' },
    ],
    audit: [],
    attachments: [],
  };
}

let database;
let writeQueue = Promise.resolve();

export async function initDatabase() {
  if (database) return database;
  fs.mkdirSync(dataDir, { recursive: true });
  if (fs.existsSync(dataFile)) {
    try {
      database = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch (error) {
      throw new Error(`Unable to read manager data file: ${error.message}`);
    }
  } else {
    database = makeSeed();
    await persistDatabase();
  }
  for (const key of ['users', 'team', 'tasks', 'events', 'projects', 'reviews', 'workLogs', 'leaves', 'issues', 'followUps', 'notes', 'meetings', 'activity', 'audit', 'attachments']) {
    if (!Array.isArray(database[key])) database[key] = [];
  }
  return database;
}

export function getDatabase() {
  if (!database) throw new Error('Database has not been initialized');
  return database;
}

export function persistDatabase() {
  if (!database) return Promise.resolve();
  writeQueue = writeQueue.then(async () => {
    await fs.promises.mkdir(dataDir, { recursive: true });
    const tempPath = `${dataFile}.tmp`;
    await fs.promises.writeFile(tempPath, JSON.stringify(database, null, 2), { mode: 0o600 });
    await fs.promises.rename(tempPath, dataFile);
  });
  return writeQueue;
}

export function newId(prefix = 'record') {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function safePublicUser(user) {
  return user ? { id: user.id, role: 'manager', mustChangePassword: Boolean(user.mustChangePassword) } : null;
}
