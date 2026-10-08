import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertCircle, ArrowUpRight, Bell, BriefcaseBusiness, CalendarDays, ChevronDown, ChevronLeft, ChevronRight,
  ClipboardCheck, Clock3, FileText, Flag, FolderKanban, History, LayoutDashboard, LockKeyhole, LogOut, Menu,
  MessageSquareText, Plus, Search, Settings, Shield, ShieldAlert, UsersRound, X,
} from 'lucide-react';
import {
  ActivityView, DashboardView, FollowUpsView, IssuesView, LeaveView, MeetingsView, MemberProfileView, NotesView,
  PerformanceView, ProjectsView, ReportsView, ScheduleView, SettingsView, TeamView, WorkBoardView, WorkLogView,
} from './views.jsx';
import { EditorModal } from './forms.jsx';
import { Avatar, Badge, Button, IconButton, LoadingScreen } from './ui.jsx';
import { todayISO } from './lib.js';

const NAV = [
  { group: 'OVERVIEW', items: [{ label: 'Dashboard', icon: LayoutDashboard }] },
  { group: 'TEAM', items: [
    { label: 'All Team', icon: UsersRound }, { label: 'Moderation', icon: Shield }, { label: 'Content', icon: FileText },
    { label: 'BD', icon: BriefcaseBusiness }, { label: 'Shiller', icon: MessageSquareText }, { label: 'Creative', icon: Activity }, { label: 'Research / Analyst', icon: Search },
  ] },
  { group: 'WORK', items: [{ label: 'Work Board', icon: ClipboardCheck }, { label: 'Daily Work Log', icon: Clock3 }, { label: 'Projects', icon: FolderKanban }] },
  { group: 'SCHEDULE', items: [{ label: 'Event Schedule', icon: CalendarDays }, { label: 'Calendar', icon: CalendarDays }, { label: 'Meetings', icon: UsersRound }] },
  { group: 'PERFORMANCE', items: [{ label: 'Performance Review', icon: Activity }, { label: 'Performance History', icon: History }] },
  { group: 'MANAGEMENT', items: [{ label: 'Leave', icon: Clock3 }, { label: 'Issues', icon: ShieldAlert }, { label: 'Follow-ups', icon: Flag }, { label: 'Manager Notes', icon: MessageSquareText }] },
  { group: 'REPORTS', items: [{ label: 'Daily Reports', icon: FileText }, { label: 'Weekly Reports', icon: FileText }, { label: 'Monthly Reports', icon: FileText }] },
  { group: 'SYSTEM', items: [{ label: 'Activity History', icon: Activity }, { label: 'Audit Log', icon: History }, { label: 'Settings', icon: Settings }] },
];

const reportInitial = { 'Daily Reports': 'Daily Team Report', 'Weekly Reports': 'Weekly Team Report', 'Monthly Reports': 'Monthly Team Report' };

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (options.body && !isFormData && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(path, { ...options, headers, credentials: 'include' });
  let result = {};
  try { result = await response.json(); } catch { /* non-JSON response */ }
  if (!response.ok) throw new Error(result.error || 'The request could not be completed.');
  return result;
}

function AliceLogo({ compact = false }) {
  const [failed, setFailed] = useState(false);
  return <span className={`alice-logo ${compact ? 'alice-logo-compact' : ''}`} aria-label="Alice">{!failed ? <img className="alice-site-icon" src="https://thealiceai.com/favicon.ico" alt="Alice logo" onError={() => setFailed(true)} /> : <span className="alice-infinity">∞</span>}<strong>alice</strong></span>;
}

function KixlyLogo({ compact = false }) {
  const [failed, setFailed] = useState(false);
  return <span className={`kixly-logo ${compact ? 'kixly-logo-compact' : ''}`} aria-label="Kixly">{!failed && <img src="https://kixly.co/brand/kixly-logo.svg" alt="Kixly logo" onError={() => setFailed(true)} />}{failed && <strong>KIXLY</strong>}</span>;
}

function BrandLockup({ compact = false }) {
  return <div className={`brand-lockup ${compact ? 'brand-lockup-compact' : ''}`}><AliceLogo compact={compact} /><span className="brand-x">×</span><KixlyLogo compact={compact} /></div>;
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try { await onLogin(email, password); }
    catch (exception) { setError(exception.message); }
    finally { setBusy(false); }
  }
  return <div className="auth-screen"><div className="auth-side-art"><div className="auth-art-inner"><BrandLockup /><div className="auth-art-copy"><span className="auth-overline"><i /> PRIVATE MANAGER WORKSPACE</span><h1>Keep the whole operation<br /><em>in good hands.</em></h1><p>People, work, schedules, performance, and history—built for one Manager to see the complete picture.</p><div className="auth-art-stats"><div><UsersRound size={17} /><span><strong>One clear team view</strong><small>People · responsibilities · availability</small></span></div><div><ClipboardCheck size={17} /><span><strong>Connected work records</strong><small>Tasks · projects · events · reviews</small></span></div><div><History size={17} /><span><strong>History stays attached</strong><small>Private notes · audits · follow-ups</small></span></div></div></div><div className="auth-art-foot"><span>ALICE × KIXLY</span><span>Manager Control Center · Private access</span></div><div className="auth-art-shape auth-art-shape-one" /><div className="auth-art-shape auth-art-shape-two" /></div></div><div className="auth-form-side"><div className="auth-form-card"><div className="auth-mobile-brand"><BrandLockup /></div><span className="auth-mini-eyebrow">WELCOME BACK</span><h2>Sign in to your workspace</h2><p className="auth-intro">This workspace is restricted to authorized Managers.</p><form onSubmit={submit} className="auth-form"><label><span>Manager email</span><div className="auth-input"><span className="input-icon">@</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your manager email" autoComplete="username" required /></div></label><label><span>Password</span><div className="auth-input"><span className="input-icon"><LockKeyhole size={16} /></span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required /></div></label>{error && <div className="auth-error"><AlertCircle size={15} />{error}</div>}<button className="auth-submit" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}<ArrowUpRight size={17} /></button></form><div className="auth-security"><Shield size={15} /><span>Secure manager-only access<br /><small>No team member sign-up or personal logins.</small></span></div><div className="auth-help">Forgot access? Contact an existing Manager to provision access securely.</div></div><div className="auth-form-footer">© {new Date().getFullYear()} · Alice × Kixly <span>Private operations data</span></div></div></div>;
}

function PasswordGate({ onComplete, onLogout }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError('');
    if (newPassword !== confirmPassword) return setError('New password and confirmation do not match.');
    if (newPassword.length < 12) return setError('Use at least 12 characters for your new password.');
    setBusy(true);
    try { await onComplete(currentPassword, newPassword); }
    catch (exception) { setError(exception.message); }
    finally { setBusy(false); }
  }
  return <div className="password-gate"><div className="password-card"><BrandLockup /><span className="auth-mini-eyebrow">FIRST SIGN-IN SECURITY</span><h1>Create a new password</h1><p>For security, set a private password before opening the Manager workspace.</p><form className="settings-form" onSubmit={submit}><label className="form-field"><span className="field-label">Current temporary password</span><input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required autoComplete="current-password" /></label><label className="form-field"><span className="field-label">New password</span><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required minLength={12} autoComplete="new-password" /><small>At least 12 characters. Avoid reusing another account password.</small></label><label className="form-field"><span className="field-label">Confirm new password</span><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={12} autoComplete="new-password" /></label>{error && <div className="auth-error"><AlertCircle size={15} />{error}</div>}<Button type="submit" disabled={busy}>{busy ? 'Securing workspace…' : 'Save new password'}<ArrowUpRight size={16} /></Button></form><button className="password-signout" onClick={onLogout}><LogOut size={14} />Sign out instead</button></div></div>;
}

function Sidebar({ activeView, onNavigate, open, close, openTaskCount = 0 }) {
  return <><div className={`sidebar-scrim ${open ? 'show' : ''}`} onClick={close} /><aside className={`app-sidebar ${open ? 'sidebar-open' : ''}`}><div className="sidebar-top"><BrandLockup /><button className="sidebar-mobile-close" onClick={close}><X size={18} /></button></div><div className="sidebar-workspace"><span className="workspace-icon"><Shield size={15} /></span><div><strong>Manager Control Center</strong><small>ALICE × KIXLY · PRIVATE</small></div><ChevronDown size={14} /></div><nav className="sidebar-nav">{NAV.map((section) => <div className="nav-section" key={section.group}><span className="nav-label">{section.group}</span>{section.items.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeView === label || (activeView === '__profile' && label === 'All Team') ? 'active' : ''}`} onClick={() => { onNavigate(label); close(); }}><Icon size={17} strokeWidth={1.85} /><span>{label}</span>{label === 'Work Board' && openTaskCount > 0 && <span className="nav-count">{openTaskCount}</span>}</button>)}</div>)}</nav><div className="sidebar-bottom"><div className="sidebar-private-card"><span><LockKeyhole size={15} /></span><div><strong>Manager-only workspace</strong><small>Private records · Single role</small></div></div><div className="sidebar-footer"><div className="sidebar-avatar">M</div><div><strong>Manager</strong><small>Authorized access</small></div><span className="sidebar-live" title="Session active" /></div></div></aside></>;
}

function GlobalSearch({ data, query, setQuery, onNavigate, onEdit, onClose }) {
  const text = query.toLowerCase().trim();
  if (!text) return null;
  const matches = [];
  data.team.filter((person) => `${person.name} ${person.role} ${person.department}`.toLowerCase().includes(text)).slice(0, 3).forEach((person) => matches.push({ id: person.id, label: person.name, sub: `${person.role} · ${person.department}`, type: 'Person', action: () => onNavigate('profile', person.id) }));
  data.tasks.filter((task) => `${task.taskName} ${task.department} ${task.description}`.toLowerCase().includes(text)).slice(0, 4).forEach((task) => matches.push({ id: task.id, label: task.taskName, sub: `${task.status} · ${task.department}`, type: 'Task', action: () => onEdit('tasks', task) }));
  data.events.filter((event) => `${event.eventName} ${event.eventType}`.toLowerCase().includes(text)).slice(0, 3).forEach((event) => matches.push({ id: event.id, label: event.eventName, sub: `${event.eventType} · ${event.date}`, type: 'Event', action: () => { onNavigate('Event Schedule'); } }));
  return <div className="global-search-results">{matches.map((match) => <button key={`${match.type}-${match.id}`} onClick={() => { match.action(); onClose(); }}><span className="search-result-icon">{match.type === 'Person' ? <UsersRound size={15} /> : match.type === 'Task' ? <ClipboardCheck size={15} /> : <CalendarDays size={15} />}</span><span><strong>{match.label}</strong><small>{match.sub}</small></span><Badge tone="neutral">{match.type}</Badge></button>)}{!matches.length && <div className="search-no-results">No matching people, tasks, or events.</div>}</div>;
}

function Topbar({ pageTitle, onMenu, onQuickAdd, onLogout, data, onNavigate, onEdit }) {
  const [search, setSearch] = useState('');
  const [showQuick, setShowQuick] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const tasks = data.tasks || [];
  const urgentOverdue = tasks.filter((task) => task.status !== 'Done' && task.priority === 'Urgent' && task.dueDate < todayISO()).length;
  const overdue = tasks.filter((task) => task.status !== 'Done' && task.dueDate < todayISO()).length;
  const leaveCount = (data.leaves || []).filter((leave) => !leave.actualReturn).length;
  const alertCount = urgentOverdue + leaveCount;
  return <header className="topbar"><div className="topbar-left"><button className="mobile-menu-button" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button><div className="breadcrumb"><span>Alice × Kixly</span><ChevronRight size={14} /><strong>{pageTitle}</strong></div></div><div className="topbar-right"><div className="top-search-wrap"><label className="top-search"><Search size={16} /><input placeholder="Search records…" value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>⌘ K</kbd></label>{search && <GlobalSearch data={data} query={search} setQuery={setSearch} onNavigate={onNavigate} onEdit={onEdit} onClose={() => setSearch('')} />}</div><div className="quick-add-wrap"><button className="top-quick-add" onClick={() => setShowQuick((value) => !value)}><Plus size={16} />Quick add<ChevronDown size={13} /></button>{showQuick && <div className="quick-add-menu">{[['Add team member', 'team'], ['New task', 'tasks'], ['Schedule event', 'events'], ['New project', 'projects'], ['Add follow-up', 'followUps']].map(([label, kind]) => <button key={kind} onClick={() => { onQuickAdd(kind); setShowQuick(false); }}><Plus size={14} />{label}</button>)}</div>}</div><div className="top-alert-wrap"><IconButton label="Manager alerts" className={showAlerts ? 'active' : ''} onClick={() => setShowAlerts((value) => !value)}><Bell size={17} />{alertCount > 0 && <i className="notification-dot" />}</IconButton>{showAlerts && <div className="top-alert-popover"><strong>Manager alerts</strong><p>{urgentOverdue ? `${urgentOverdue} urgent task${urgentOverdue === 1 ? '' : 's'} overdue` : 'No urgent overdue tasks.'}</p><p>{overdue ? `${overdue} total overdue task${overdue === 1 ? '' : 's'}` : 'No overdue tasks.'}</p><p>{leaveCount ? `${leaveCount} team member${leaveCount === 1 ? '' : 's'} currently on leave` : 'No active leave records.'}</p><button onClick={() => { onNavigate('Work Board'); setShowAlerts(false); }}>Open Work Board <ArrowUpRight size={13} /></button></div>}</div><span className="topbar-divider" /><div className="manager-pill"><Avatar name="Manager" size="xs" /><span><strong>Manager</strong><small>Private access</small></span><button onClick={onLogout} title="Sign out" aria-label="Sign out"><LogOut size={15} /></button></div></div></header>;
}

export default function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [data, setData] = useState(null);
  const [activeView, setActiveView] = useState('Dashboard');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [editor, setEditor] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalError, setGlobalError] = useState('');

  useEffect(() => {
    let alive = true;
    request('/api/auth/me').then((result) => { if (alive) setUser(result.user); }).catch(() => { if (alive) setUser(null); }).finally(() => { if (alive) setAuthLoading(false); });
    return () => { alive = false; };
  }, []);

  const loadData = useCallback(async (quiet = false) => {
    if (!quiet) setPageLoading(true);
    setGlobalError('');
    try { const result = await request('/api/records'); setData(result); }
    catch (error) { setGlobalError(error.message); if (/sign in/i.test(error.message)) setUser(null); }
    finally { if (!quiet) setPageLoading(false); }
  }, []);
  useEffect(() => { if (user && !user.mustChangePassword) loadData(); }, [user?.id, user?.mustChangePassword, loadData]);

  async function signIn(email, password) {
    const result = await request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    setUser(result.user);
  }
  async function changePassword(currentPassword, newPassword) {
    const result = await request('/api/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) });
    setUser(result.user);
  }
  async function signOut() {
    try { await request('/api/auth/logout', { method: 'POST' }); } catch { /* local sign-out still succeeds */ }
    setData(null); setUser(null); setEditor(null); setActiveView('Dashboard'); setSelectedPerson(null);
  }
  async function uploadAttachment(file) {
    const formData = new FormData();
    formData.append('file', file);
    const result = await request('/api/files', { method: 'POST', body: formData });
    return result.attachment;
  }
  async function saveRecord(collection, record) {
    const isEditing = Boolean(record.id);
    const path = isEditing ? `/api/records/${collection}/${encodeURIComponent(record.id)}` : `/api/records/${collection}`;
    const result = await request(path, { method: isEditing ? 'PATCH' : 'POST', body: JSON.stringify(record) });
    await loadData(true);
    return result;
  }
  function openEditor(kind, record = null) { setEditor({ kind, record }); }
  function navigate(page, option = null) {
    if (page === 'profile') { setSelectedPerson(option); setActiveView('__profile'); return; }
    setActiveView(page); setSelectedPerson(option || null);
  }
  function add(kind, initial = null) { openEditor(kind, initial ? { ...initial } : null); }
  const titleMap = useMemo(() => new Map(NAV.flatMap((section) => section.items.map((item) => [item.label, item.label]))), []);
  const pageTitle = activeView === '__profile' ? 'Team profile' : titleMap.get(activeView) || 'Dashboard';
  const editorData = data || { team: [], tasks: [], events: [], projects: [], reviews: [], workLogs: [], leaves: [], issues: [], followUps: [], notes: [], meetings: [] };

  if (authLoading) return <LoadingScreen label="Checking secure Manager access…" />;
  if (!user) return <LoginScreen onLogin={signIn} />;
  if (user.mustChangePassword) return <PasswordGate onComplete={changePassword} onLogout={signOut} />;
  if (!data || pageLoading) return <LoadingScreen label="Loading private management records…" />;

  let content;
  if (activeView === 'Dashboard') content = <DashboardView data={data} onNavigate={navigate} onEdit={openEditor} onAdd={add} />;
  else if (activeView === 'All Team' || ['Moderation', 'Content', 'BD', 'Shiller', 'Creative', 'Research / Analyst'].includes(activeView)) content = <TeamView key={activeView} data={data} initialDepartment={activeView === 'All Team' ? 'All' : activeView} onAdd={add} onEdit={openEditor} onOpenProfile={(person) => navigate('profile', person.id)} />;
  else if (activeView === '__profile') content = <MemberProfileView data={data} personId={selectedPerson} onBack={() => navigate('All Team')} onEdit={openEditor} onCreateTask={(person) => add('tasks', { assignedTo: person.id, department: person.department, role: person.role, status: 'To Do' })} onNavigate={navigate} />;
  else if (activeView === 'Work Board') content = <WorkBoardView data={data} onAdd={add} onEdit={openEditor} onSave={saveRecord} />;
  else if (activeView === 'Daily Work Log') content = <WorkLogView data={data} onAdd={add} onEdit={openEditor} />;
  else if (activeView === 'Projects') content = <ProjectsView data={data} onAdd={add} onEdit={openEditor} onNavigate={navigate} />;
  else if (activeView === 'Event Schedule') content = <ScheduleView key={activeView} data={data} mode="events" onAdd={add} onEdit={openEditor} onSave={saveRecord} />;
  else if (activeView === 'Calendar') content = <ScheduleView key={activeView} data={data} mode="calendar" onAdd={add} onEdit={openEditor} onSave={saveRecord} />;
  else if (activeView === 'Meetings') content = <MeetingsView data={data} onAdd={add} onEdit={openEditor} />;
  else if (activeView === 'Performance Review') content = <PerformanceView key={`${activeView}-${selectedPerson || ''}`} data={data} mode="review" initialPersonId={selectedPerson || ''} onAdd={add} onEdit={openEditor} />;
  else if (activeView === 'Performance History') content = <PerformanceView data={data} mode="history" onAdd={add} onEdit={openEditor} />;
  else if (activeView === 'Leave') content = <LeaveView data={data} onAdd={add} onEdit={openEditor} onSave={saveRecord} />;
  else if (activeView === 'Issues') content = <IssuesView data={data} onAdd={add} onEdit={openEditor} />;
  else if (activeView === 'Follow-ups') content = <FollowUpsView data={data} onAdd={add} onEdit={openEditor} onSave={saveRecord} />;
  else if (activeView === 'Manager Notes') content = <NotesView data={data} initialPersonId={selectedPerson || ''} onAdd={add} onEdit={openEditor} />;
  else if (['Daily Reports', 'Weekly Reports', 'Monthly Reports'].includes(activeView)) content = <ReportsView key={activeView} data={data} initialType={reportInitial[activeView]} />;
  else if (activeView === 'Activity History') content = <ActivityView data={data} />;
  else if (activeView === 'Audit Log') content = <ActivityView data={data} audit />;
  else if (activeView === 'Settings') content = <SettingsView onCreateManager={(email, password) => request('/api/managers', { method: 'POST', body: JSON.stringify({ email, password }) })} onChangePassword={(currentPassword, newPassword) => changePassword(currentPassword, newPassword)} />;
  else content = <DashboardView data={data} onNavigate={navigate} onEdit={openEditor} onAdd={add} />;

  return <div className="app-shell"><Sidebar activeView={activeView} onNavigate={navigate} open={sidebarOpen} close={() => setSidebarOpen(false)} openTaskCount={(data?.tasks || []).filter((task) => task.status !== 'Done').length} /><div className="app-main"><Topbar pageTitle={pageTitle} onMenu={() => setSidebarOpen(true)} onQuickAdd={add} onLogout={signOut} data={data} onNavigate={navigate} onEdit={openEditor} /><main className="main-scroll" key={`${activeView}-${selectedPerson || ''}`}>{globalError && <div className="global-error"><AlertCircle size={15} />{globalError}<button onClick={loadData}>Retry</button></div>}{content}</main><footer className="app-footer"><span>© {new Date().getFullYear()} Alice × Kixly</span><span><LockKeyhole size={12} />Private Manager workspace</span><button onClick={() => navigate('Settings')}>Security & settings</button></footer></div>{editor && <EditorModal kind={editor.kind} record={editor.record} data={editorData} onSave={saveRecord} onUpload={uploadAttachment} onClose={() => setEditor(null)} />}</div>;
}
