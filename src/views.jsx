import React, { useMemo, useState } from 'react';
import {
  Activity, ArrowDown, ArrowUp, ArrowUpRight, Bell, CalendarDays, Check, CheckCircle2, CircleAlert, ClipboardCheck, Clock3,
  Download, FileClock, FileText, Filter, Flag, FolderKanban, History, ListChecks, MapPin, MessageSquareText, MoreHorizontal, Paperclip,
  Plus, Search, ShieldAlert, Sparkles, TrendingUp, UsersRound, X,
} from 'lucide-react';
import { Avatar, Badge, Button, IconButton, Modal, RecordForm } from './ui.jsx';
import { EditorModal } from './forms.jsx';
import {
  DEPARTMENTS, EVENT_STATUSES, PRIORITIES, REPORT_TYPES, TASK_STATUSES, buildReportRows, compareDate, departmentMetrics,
  formatDate, formatDateTime, initialsColor, isOverdue, isSoon, nameFor, performanceMetrics, shiftDate, taskMetrics, todayISO,
} from './lib.js';

const defaultData = { team: [], tasks: [], events: [], projects: [], reviews: [], workLogs: [], leaves: [], issues: [], followUps: [], notes: [], meetings: [], activity: [], audit: [] };
const upcomingEvents = (data) => (data.events || []).filter((event) => event.date >= todayISO() && !['Completed', 'Cancelled'].includes(event.status)).sort((a, b) => compareDate(a.date, b.date));
const taskOwner = (task, team) => team.find((person) => person.id === task.assignedTo);
const eventTeamNames = (event, team) => (event.assignedTeamMembers || []).map((id) => nameFor(id, team)).join(', ');
const titleCaseStatus = (status = '') => status;

function ViewIntro({ eyebrow, title, description, action }) {
  return <div className="view-intro"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>;
}

function EmptyState({ icon: Icon = Sparkles, title, description, action }) {
  return <div className="empty-state"><span><Icon size={20} /></span><strong>{title}</strong><p>{description}</p>{action}</div>;
}

function SectionHeading({ title, note, action }) {
  return <div className="section-heading"><div><h3>{title}</h3>{note && <p>{note}</p>}</div>{action}</div>;
}

function PriorityBadge({ priority }) {
  const tone = priority === 'Urgent' ? 'urgent' : priority === 'High' ? 'high' : priority === 'Medium' ? 'medium' : 'low';
  return <Badge tone={tone} dot>{priority || 'Medium'}</Badge>;
}

function TaskStatusBadge({ status }) {
  const tone = status === 'Done' ? 'success' : status === 'In Review' ? 'purple' : status === 'In Progress' ? 'blue' : 'neutral';
  return <Badge tone={tone}>{status}</Badge>;
}

function TaskCard({ task, data, onEdit, onMove }) {
  const person = taskOwner(task, data.team);
  const project = data.projects.find((item) => item.id === task.relatedProject);
  const event = data.events.find((item) => item.id === task.relatedEvent);
  return <article className="task-card" onClick={() => onEdit(task)}>
    <div className="task-card-top"><PriorityBadge priority={task.priority} /><button type="button" className="task-menu" aria-label="Edit task" onClick={(eventClick) => { eventClick.stopPropagation(); onEdit(task); }}><MoreHorizontal size={17} /></button></div>
    <h4>{task.taskName}</h4>
    <p className="task-description">{task.description || 'No description added.'}</p>
    <div className="task-card-meta"><Badge tone="department">{task.department || 'Unassigned department'}</Badge>{task.role && <span className="task-role">{task.role}</span>}</div>
    <div className="task-assignee-row"><Avatar name={person?.name || 'Unassigned'} size="xs" /><span>{person?.name || 'Unassigned'}</span><span className={`task-due ${task.status !== 'Done' && isOverdue(task.dueDate) ? 'overdue-text' : isSoon(task.dueDate, 2) ? 'soon-text' : ''}`}><Clock3 size={13} />{task.dueDate ? formatDate(task.dueDate) : 'No due date'}</span></div>
    <div className="task-progress-line"><div className="progress-track"><i style={{ width: `${Math.min(100, Number(task.progress || 0))}%` }} /></div><span>{Math.min(100, Number(task.progress || 0))}%</span></div>
    {(project || event || task.attachments?.length > 0) && <div className="task-related">{project && <span><FolderKanban size={12} />{project.projectName}</span>}{event && <span><CalendarDays size={12} />{event.eventName}</span>}{task.attachments?.length > 0 && <span><Paperclip size={12} />{task.attachments.length} file{task.attachments.length === 1 ? '' : 's'}</span>}</div>}
    <div className="task-card-footer" onClick={(eventClick) => eventClick.stopPropagation()}><TaskStatusBadge status={task.status} /><select value={task.status} onChange={(eventChange) => onMove(task, eventChange.target.value)} aria-label={`Change status for ${task.taskName}`}>{TASK_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div>
  </article>;
}

export function DashboardView({ data: incoming, onNavigate, onEdit, onAdd }) {
  const data = { ...defaultData, ...incoming };
  const team = data.team.filter((member) => !member.archivedAt);
  const tasks = data.tasks.filter((task) => !task.archivedAt);
  const events = data.events.filter((event) => !event.archivedAt);
  const openTasks = tasks.filter((task) => task.status !== 'Done');
  const overdueTasks = openTasks.filter((task) => isOverdue(task.dueDate));
  const onLeaveIds = new Set(data.leaves.filter((leave) => !leave.actualReturn).map((leave) => leave.personId));
  const todayEvents = events.filter((event) => event.date === todayISO() && event.status !== 'Cancelled');
  const nextEvents = upcomingEvents(data);
  const todayTasks = tasks.filter((task) => task.status !== 'Done' && task.dueDate === todayISO());
  const upcomingFollowUps = data.followUps.filter((item) => item.status === 'Pending').sort((a, b) => compareDate(a.dueDate, b.dueDate));
  const recentActivity = [...data.activity].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 7);
  const averageScore = team.length ? Math.round(team.reduce((sum, member) => sum + Number(member.currentScore || 0), 0) / team.length) : 0;
  const reviewDue = team.filter((person) => {
    const last = data.reviews.filter((review) => review.personId === person.id).sort((a, b) => compareDate(b.periodEnd, a.periodEnd))[0];
    return !last || (last.periodEnd && last.periodEnd < shiftDate(todayISO(), -28));
  }).length;
  const nextSevenDays = events.filter((event) => event.date >= todayISO() && event.date <= shiftDate(todayISO(), 7) && !['Completed', 'Cancelled'].includes(event.status)).length;
  const dueFollowUps = upcomingFollowUps.filter((item) => !item.dueDate || item.dueDate <= shiftDate(todayISO(), 7)).length;
  const alerts = [];
  overdueTasks.filter((task) => task.priority === 'Urgent').forEach((task) => alerts.push({ tone: 'red', icon: ShieldAlert, text: `Urgent task overdue: ${task.taskName}`, person: nameFor(task.assignedTo, team) }));
  const criticalIssues = data.issues.filter((issue) => issue.status === 'Open' && issue.priority === 'Urgent');
  criticalIssues.forEach((issue) => alerts.push({ tone: 'red', icon: CircleAlert, text: `Urgent issue: ${issue.issue}`, person: issue.personId ? nameFor(issue.personId, team) : 'Unassigned' }));
  if (overdueTasks.some((task) => task.priority !== 'Urgent')) alerts.push({ tone: 'amber', icon: Clock3, text: `${overdueTasks.filter((task) => task.priority !== 'Urgent').length} task deadline${overdueTasks.length === 1 ? '' : 's'} overdue`, person: 'Work Board' });
  tasks.filter((task) => task.status !== 'Done' && isSoon(task.dueDate, 1)).forEach((task) => alerts.push({ tone: 'amber', icon: Clock3, text: `Task deadline approaching: ${task.taskName}`, person: nameFor(task.assignedTo, team) }));
  if (reviewDue) alerts.push({ tone: 'amber', icon: FileClock, text: `${reviewDue} performance review${reviewDue === 1 ? '' : 's'} due`, person: 'Performance' });
  if (dueFollowUps) alerts.push({ tone: 'amber', icon: Flag, text: `${dueFollowUps} follow-up${dueFollowUps === 1 ? '' : 's'} due this week`, person: 'Follow-ups' });
  if (onLeaveIds.size) alerts.push({ tone: 'blue', icon: UsersRound, text: `${onLeaveIds.size} team member${onLeaveIds.size === 1 ? '' : 's'} currently on leave`, person: 'Leave records' });
  data.activity.filter((entry) => /^(Task completed:|Event completed:)/.test(entry.message || '') && Date.now() - new Date(entry.timestamp).getTime() < 24 * 60 * 60 * 1000).slice(0, 3).forEach((entry) => alerts.push({ tone: 'green', icon: CheckCircle2, text: entry.message, person: 'Completed today' }));
  const nextUp = [
    ...todayEvents.map((event) => ({ date: event.date, time: event.startTime, type: 'Event', title: event.eventName, subtitle: event.eventType, icon: CalendarDays })),
    ...todayTasks.map((task) => ({ date: task.dueDate, time: '', type: 'Deadline', title: task.taskName, subtitle: nameFor(task.assignedTo, team), icon: ClipboardCheck })),
    ...data.meetings.filter((meeting) => meeting.date === todayISO()).map((meeting) => ({ date: meeting.date, time: meeting.time, type: 'Meeting', title: meeting.meetingName, subtitle: meeting.meetingType, icon: UsersRound })),
    ...upcomingFollowUps.filter((item) => item.dueDate === todayISO()).map((item) => ({ date: item.dueDate, type: 'Follow-up', title: item.followUp, subtitle: nameFor(item.personId, team), icon: Flag })),
  ].sort((a, b) => String(a.time || '').localeCompare(String(b.time || '')));
  const nextWeek = [
    ...nextEvents.filter((event) => event.date > todayISO() && event.date <= shiftDate(todayISO(), 7)).map((event) => ({ date: event.date, time: event.startTime, type: 'Event', title: event.eventName, subtitle: event.eventType, icon: CalendarDays })),
    ...tasks.filter((task) => task.status !== 'Done' && task.dueDate > todayISO() && task.dueDate <= shiftDate(todayISO(), 7)).map((task) => ({ date: task.dueDate, type: 'Deadline', title: task.taskName, subtitle: nameFor(task.assignedTo, team), icon: ClipboardCheck })),
    ...data.meetings.filter((meeting) => meeting.date > todayISO() && meeting.date <= shiftDate(todayISO(), 7)).map((meeting) => ({ date: meeting.date, time: meeting.time, type: 'Meeting', title: meeting.meetingName, subtitle: meeting.meetingType, icon: UsersRound })),
    ...upcomingFollowUps.filter((item) => item.dueDate > todayISO() && item.dueDate <= shiftDate(todayISO(), 7)).map((item) => ({ date: item.dueDate, type: 'Follow-up', title: item.followUp, subtitle: nameFor(item.personId, team), icon: Flag })),
    ...team.filter((person) => { const last = data.reviews.filter((review) => review.personId === person.id).sort((a, b) => compareDate(b.periodEnd, a.periodEnd))[0]; return !last || !last.periodEnd || last.periodEnd < shiftDate(todayISO(), -28); }).map((person) => ({ date: todayISO(), type: 'Review', title: `${person.name} performance review`, subtitle: person.department, icon: Activity })),
  ].sort((a, b) => compareDate(a.date, b.date));
  const pendingMeetings = data.meetings.filter((meeting) => meeting.date >= todayISO()).length;
  const summaryCards = [
    { label: 'Total team', value: team.length, sub: `${team.filter((person) => person.status === 'Active').length} active · ${onLeaveIds.size} on leave`, icon: UsersRound, tone: 'purple', action: () => onNavigate('All Team') },
    { label: 'Open tasks', value: openTasks.length, sub: `${tasks.filter((task) => task.status === 'In Progress').length} in progress · ${tasks.filter((task) => task.status === 'In Review').length} in review`, icon: ClipboardCheck, tone: 'blue', action: () => onNavigate('Work Board') },
    { label: 'Overdue', value: overdueTasks.length, sub: `${overdueTasks.filter((task) => task.priority === 'Urgent').length} urgent needs attention`, icon: Clock3, tone: overdueTasks.length ? 'rose' : 'mint', action: () => onNavigate('Work Board') },
    { label: 'Upcoming events', value: nextSevenDays, sub: `${todayEvents.length} scheduled today`, icon: CalendarDays, tone: 'mint', action: () => onNavigate('Event Schedule') },
    { label: 'Team score', value: `${averageScore}%`, sub: `${reviewDue} reviews due`, icon: TrendingUp, tone: 'gold', action: () => onNavigate('Performance Review') },
  ];
  return <div className="page-content dashboard-page">
    <div className="welcome-banner"><div className="welcome-copy"><div className="welcome-kicker"><span className="pulse-dot" /> Manager overview <span>{new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</span></div><h2>Good morning. Here’s your operation at a glance.</h2><p>People, priorities, and schedules—together in one private workspace.</p></div><div className="welcome-actions"><Button variant="white" icon={Plus} onClick={() => onAdd('tasks')}>New task</Button><Button variant="ghost-light" icon={CalendarDays} onClick={() => onAdd('events')}>Schedule event</Button></div><div className="welcome-orb orb-one" /><div className="welcome-orb orb-two" /></div>
    <div className="kpi-grid">{summaryCards.map((card) => <button type="button" key={card.label} className="kpi-card" onClick={card.action}><div className={`kpi-icon kpi-${card.tone}`}><card.icon size={18} /></div><span className="kpi-label">{card.label}</span><strong>{card.value}</strong><small>{card.sub}</small><ArrowUpRight className="kpi-arrow" size={16} /></button>)}</div>
    <section className="today-snapshot"><div className="snapshot-heading"><strong>Today at a glance</strong><span>Daily manager view</span></div><div className="snapshot-metrics">{[
      ['Active team', team.filter((person) => person.status === 'Active').length, 'All Team'], ['On leave', onLeaveIds.size, 'Leave'], ['Tasks due today', todayTasks.length, 'Work Board'], ['Overdue tasks', overdueTasks.length, 'Work Board'], ['Events today', todayEvents.length, 'Event Schedule'], ['Reviews due', reviewDue, 'Performance Review'], ['Follow-ups due', upcomingFollowUps.filter((item) => item.dueDate === todayISO()).length, 'Follow-ups'], ['Open issues', data.issues.filter((issue) => issue.status === 'Open').length, 'Issues'],
    ].map(([label, value, target]) => <button key={label} onClick={() => onNavigate(target)}><span>{label}</span><strong className={(label === 'Overdue tasks' && value) || (label === 'Open issues' && value) ? 'snapshot-alert-value' : ''}>{value}</strong></button>)}</div></section>
    <div className="dashboard-grid">
      <section className="panel attention-panel"><SectionHeading title="Needs your attention" note="Actionable items across the team" action={<button className="text-button" onClick={() => onNavigate('Follow-ups')}>Open inbox <ArrowUpRight size={14} /></button>} />
        {alerts.length ? <div className="alert-list">{alerts.slice(0, 6).map((alert, index) => <button type="button" className={`alert-row alert-${alert.tone}`} key={`${alert.text}-${index}`} onClick={() => onNavigate(alert.person === 'Performance' ? 'Performance Review' : alert.person === 'Follow-ups' ? 'Follow-ups' : alert.person === 'Leave records' ? 'Leave' : alert.text.includes('issue') ? 'Issues' : alert.text.startsWith('Event completed:') ? 'Event Schedule' : 'Work Board')}><span className="alert-icon"><alert.icon size={16} /></span><span className="alert-content"><strong>{alert.text}</strong><small>{alert.person}</small></span><ArrowUpRight size={15} /></button>)}</div> : <EmptyState icon={CheckCircle2} title="All clear" description="Nothing urgent needs your attention right now." />}
      </section>
      <section className="panel upcoming-panel"><SectionHeading title="Upcoming" note="A clear view of what’s next" action={<button className="text-button" onClick={() => onNavigate('Calendar')}>View calendar <ArrowUpRight size={14} /></button>} />
        <div className="upcoming-tabs"><span className="upcoming-label">Today</span><span className="upcoming-count">{nextUp.length}</span></div>
        {nextUp.length ? <div className="upcoming-list">{nextUp.slice(0, 4).map((item, index) => <UpcomingRow key={`${item.type}-${item.title}-${index}`} item={item} team={team} />)}</div> : <p className="quiet-empty">No events, deadlines, meetings, or follow-ups today.</p>}
        <div className="upcoming-tabs next-seven"><span className="upcoming-label">Next 7 days</span><span className="upcoming-count">{nextWeek.length}</span></div>
        {nextWeek.length ? <div className="upcoming-list">{nextWeek.slice(0, 3).map((item, index) => <UpcomingRow key={`${item.type}-${item.title}-${index}`} item={item} team={team} />)}</div> : <p className="quiet-empty">Your next 7 days are clear.</p>}
      </section>
      <section className="panel work-snapshot"><SectionHeading title="Work board" note="Most immediate work items" action={<button className="text-button" onClick={() => onNavigate('Work Board')}>Open board <ArrowUpRight size={14} /></button>} />
        {tasks.filter((task) => task.status !== 'Done').sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || '')).slice(0, 4).map((task) => <button className="compact-task-row" key={task.id} onClick={() => onEdit('tasks', task)}><span className="compact-task-main"><span className={`compact-priority priority-${(task.priority || 'medium').toLowerCase()}`} /><strong>{task.taskName}</strong><small>{nameFor(task.assignedTo, team)} · {task.department}</small></span><span className={`compact-date ${isOverdue(task.dueDate) ? 'overdue-text' : ''}`}>{task.dueDate ? formatDate(task.dueDate) : 'No due date'}</span></button>)}
        {!openTasks.length && <p className="quiet-empty">No open tasks. Nice work.</p>}
      </section>
      <section className="panel activity-panel"><SectionHeading title="Activity timeline" note="Recent changes in your workspace" action={<button className="text-button" onClick={() => onNavigate('Activity History')}>Full history <ArrowUpRight size={14} /></button>} />
        {recentActivity.length ? <div className="activity-timeline">{recentActivity.map((item) => <div className="activity-row" key={item.id}><span className="activity-marker"><Activity size={13} /></span><div><strong>{item.message}</strong><small>{item.actor || 'Manager'} · {formatDateTime(item.timestamp)}</small></div></div>)}</div> : <p className="quiet-empty">Manager activity will appear here as records change.</p>}
      </section>
      <section className="panel department-panel"><SectionHeading title="Department pulse" note="Operational workload by team" action={<button className="text-button" onClick={() => onNavigate('Performance Review')}>Performance <ArrowUpRight size={14} /></button>} />
        {DEPARTMENTS.filter((department) => department !== 'Other').map((department) => { const metrics = departmentMetrics(data, department); return <div className="department-pulse-row" key={department}><span className="dept-color-dot" data-dept={department} /><div className="department-pulse-main"><strong>{department}</strong><small>{metrics.teamSize} members · {metrics.tasksCompleted} completed · {metrics.pendingTasks} pending</small></div><div className="score-mini"><strong>{metrics.averagePerformance}%</strong><div><i style={{ width: `${metrics.averagePerformance}%` }} /></div></div></div>; })}
      </section>
      <section className="panel important-notes-panel"><SectionHeading title="Important notes" note="Private manager-only context" action={<button className="text-button" onClick={() => onNavigate('Manager Notes')}>All notes <ArrowUpRight size={14} /></button>} />{[...data.notes].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3).map((note) => <button className="important-note-row" key={note.id} onClick={() => onNavigate('Manager Notes', note.targetType === 'Person' ? note.targetId : null)}><span><MessageSquareText size={14} /></span><div><strong>{note.title}</strong><small>{note.targetType === 'Person' ? nameFor(note.targetId, team) : note.targetId || note.department || note.targetType} · {formatDate(note.createdAt)}</small><p>{note.body}</p></div></button>)}{!data.notes.length && <p className="quiet-empty">No private notes saved yet.</p>}</section>
    </div>
  </div>;
}

function UpcomingRow({ item, team }) {
  return <div className="upcoming-row"><span className="upcoming-item-icon"><item.icon size={15} /></span><div className="upcoming-item-main"><span><Badge tone="neutral">{item.type}</Badge><strong>{item.title}</strong></span><small>{formatDate(item.date)}{item.time ? ` · ${item.time}` : ''} · {item.subtitle || 'Manager'}</small></div></div>;
}

export function TeamView({ data: incoming, initialDepartment = 'All', onAdd, onEdit, onOpenProfile }) {
  const data = { ...defaultData, ...incoming };
  const [department, setDepartment] = useState(initialDepartment);
  const [query, setQuery] = useState('');
  const filters = ['All', ...DEPARTMENTS];
  const current = data.team.filter((person) => (department === 'All' || person.department === department) && `${person.name} ${person.username || ''} ${person.role} ${person.currentWork || ''}`.toLowerCase().includes(query.toLowerCase()));
  const onLeaveIds = new Set(data.leaves.filter((leave) => !leave.actualReturn).map((leave) => leave.personId));
  return <div className="page-content">
    <ViewIntro eyebrow="Team directory" title="All team" description="Your central team database. Team members are managed by the Manager—there are no separate team logins." action={<Button icon={Plus} onClick={() => onAdd('team')}>Add team member</Button>} />
    <div className="directory-filter-bar"><div className="filter-chips">{filters.map((filter) => <button key={filter} className={`filter-chip ${department === filter ? 'active' : ''}`} onClick={() => setDepartment(filter)}>{filter}{filter !== 'All' && <span>{data.team.filter((person) => person.department === filter).length}</span>}</button>)}</div><label className="inline-search"><Search size={15} /><input placeholder="Search team" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div>
    <div className="table-card"><div className="table-scroll"><table className="data-table team-table"><thead><tr><th>Name</th><th>Role</th><th>Department</th><th>Status</th><th>Joined</th><th>Current work</th><th>Performance</th><th /></tr></thead><tbody>{current.map((person) => <tr key={person.id} onClick={() => onOpenProfile(person)}><td><div className="person-cell"><Avatar name={person.name} color={initialsColor(person.name)} /><span><strong>{person.name}</strong><small>{person.username || 'No username added'}</small></span></div></td><td><span className="role-pill">{person.role}</span>{person.role === 'Mod Lead' && person.assignedMods?.length > 0 && <small className="subcell">{person.assignedMods.length} assigned mods</small>}</td><td><Badge tone="department">{person.department}</Badge></td><td><Badge tone={person.status === 'Active' ? 'success' : 'offline'} dot>{person.status}</Badge>{onLeaveIds.has(person.id) && <small className="leave-indicator">On leave</small>}</td><td>{formatDate(person.joined)}</td><td className="work-cell">{person.currentWork || '—'}</td><td><div className="score-cell"><strong>{Number(person.currentScore || 0)}%</strong><div><i style={{ width: `${Math.min(100, Number(person.currentScore || 0))}%` }} /></div></div></td><td><button className="row-action" onClick={(event) => { event.stopPropagation(); onEdit('team', person); }}>Edit</button></td></tr>)}</tbody></table></div>{current.length === 0 && <EmptyState icon={UsersRound} title="No matching team members" description="Try a different department filter or add a team member." action={<Button icon={Plus} onClick={() => onAdd('team')}>Add team member</Button>} />}</div>
    <div className="privacy-hint"><ShieldAlert size={14} /> Private manager records · Status options are limited to Active and Offline. Leave details are stored separately.</div>
  </div>;
}

export function MemberProfileView({ data: incoming, personId, onBack, onEdit, onCreateTask, onNavigate }) {
  const data = { ...defaultData, ...incoming };
  const person = data.team.find((item) => item.id === personId);
  if (!person) return <div className="page-content"><Button variant="quiet" onClick={onBack}>Back to team</Button><EmptyState title="Team member not found" description="This record may have been archived." /></div>;
  const tasks = data.tasks.filter((task) => task.assignedTo === person.id).sort((a, b) => compareDate(a.dueDate, b.dueDate));
  const projects = data.projects.filter((project) => (project.teamMembers || []).includes(person.id) || (person.projects || []).includes(project.id));
  const events = data.events.filter((event) => (event.assignedTeamMembers || []).includes(person.id));
  const reviews = data.reviews.filter((review) => review.personId === person.id).sort((a, b) => compareDate(b.periodEnd, a.periodEnd));
  const logs = data.workLogs.filter((log) => log.personId === person.id).sort((a, b) => compareDate(b.date, a.date));
  const leaves = data.leaves.filter((leave) => leave.personId === person.id).sort((a, b) => compareDate(b.leaveStart, a.leaveStart));
  const notes = data.notes.filter((note) => note.targetType === 'Person' && note.targetId === person.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const issues = data.issues.filter((issue) => issue.personId === person.id);
  const metrics = performanceMetrics(data, person.id);
  const onLeave = leaves.some((leave) => !leave.actualReturn);
  const lead = data.team.find((member) => (member.assignedMods || []).includes(person.id));
  const assignedMods = (person.assignedMods || []).map((id) => data.team.find((member) => member.id === id)).filter(Boolean);
  return <div className="page-content profile-page">
    <div className="profile-back-row"><button className="back-link" onClick={onBack}>← All team</button><div className="profile-actions"><Button variant="secondary" onClick={() => onCreateTask(person)}>Assign task</Button><Button icon={MoreHorizontal} variant="quiet" onClick={() => onEdit('team', person)}>Edit profile</Button></div></div>
    <section className="profile-hero"><Avatar name={person.name} color={initialsColor(person.name)} size="xl" /><div className="profile-heading"><div className="profile-name-row"><h2>{person.name}</h2><Badge tone={person.status === 'Active' ? 'success' : 'offline'} dot>{person.status}</Badge>{onLeave && <Badge tone="amber">On leave</Badge>}</div><p>{person.role} <span>·</span> {person.department} {person.username && <span className="username-inline">· {person.username}</span>}</p><div className="profile-quickfacts"><span><MapPin size={14} />{person.timezone || 'Timezone not set'}</span><span><Clock3 size={14} />{person.workingHours || 'Hours not set'}</span><span><CalendarDays size={14} />Joined {formatDate(person.joined, { year: true })}</span></div></div><div className="profile-score"><span>Current performance</span><strong>{Number(person.currentScore || 0)}<small>%</small></strong><div><i style={{ width: `${Number(person.currentScore || 0)}%` }} /></div><small>Rating {Number(person.managerRating || 0).toFixed(1)} / 5</small></div></section>
    <div className="profile-kpis">{[
      ['Tasks completed', metrics.tasksCompleted], ['Tasks pending', metrics.tasksPending], ['Overdue tasks', metrics.overdueTasks], ['Projects', projects.length], ['Events', events.length], ['Open issues', issues.filter((issue) => issue.status === 'Open').length],
    ].map(([label, value]) => <div className="profile-kpi" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
    <div className="profile-layout">
      <div className="profile-main-col">
        <section className="panel profile-section"><SectionHeading title="Responsibilities" note="Current ownership and history" action={<button className="text-button" onClick={() => onEdit('team', person)}>Update <ArrowUpRight size={14} /></button>} /><div className="responsibility-grid"><div><span className="field-label">Primary</span><p>{person.primaryResponsibility || 'Not recorded yet.'}</p></div><div><span className="field-label">Secondary</span><p>{person.secondaryResponsibility || 'Not recorded yet.'}</p></div><div><span className="field-label">Assigned communities</span><p>{person.communities || person.assignedCommunity || 'Not assigned'}</p></div><div><span className="field-label">Current work</span><p>{person.currentWork || 'No current work recorded.'}</p></div></div>
          {(lead || assignedMods.length > 0 || person.region || person.language || person.coverageHours) && <div className="mod-structure"><strong><ShieldAlert size={15} /> Moderation structure</strong><div className="mod-details">{lead && <p>Mod Lead: <b>{lead.name}</b></p>}{person.region && <p>Region: <b>{person.region}</b></p>}{person.language && <p>Language: <b>{person.language}</b></p>}{person.coverageHours && <p>Coverage: <b>{person.coverageHours}</b></p>}{assignedMods.length > 0 && <div className="assigned-mod-list"><span>Assigned mods</span>{assignedMods.map((mod) => <button key={mod.id} onClick={() => onNavigate('profile', mod.id)}><Avatar name={mod.name} size="xs" />{mod.name} <em>{mod.role}</em></button>)}</div>}{person.teamNotes && <p className="team-notes">{person.teamNotes}</p>}</div></div>}
          {person.responsibilitiesHistory?.length > 0 && <div className="responsibility-history"><span>Previous responsibilities</span>{[...person.responsibilitiesHistory].reverse().slice(0, 3).map((item, index) => <p key={`${item.changedAt}-${index}`}>{item.responsibilities}<small>{formatDate(item.changedAt, { year: true })}</small></p>)}</div>}
        </section>
        <section className="panel profile-section"><SectionHeading title="Current work" note={`${tasks.length} linked task${tasks.length === 1 ? '' : 's'}`} action={<button className="text-button" onClick={() => onCreateTask(person)}>Assign task <Plus size={14} /></button>} />
          {tasks.length ? <div className="profile-task-list">{tasks.slice(0, 5).map((task) => <button key={task.id} className="profile-task-row" onClick={() => onEdit('tasks', task)}><div><strong>{task.taskName}</strong><small>{task.description || 'No description'}{task.relatedProject ? ` · ${data.projects.find((project) => project.id === task.relatedProject)?.projectName || ''}` : ''}</small></div><div><TaskStatusBadge status={task.status} /><small className={task.status !== 'Done' && isOverdue(task.dueDate) ? 'overdue-text' : ''}>{task.dueDate ? `Due ${formatDate(task.dueDate)}` : 'No due date'}</small></div></button>)}</div> : <p className="quiet-empty">No tasks assigned.</p>}
          <div className="linked-projects"><span className="field-label">Current projects</span>{projects.length ? projects.map((project) => <button key={project.id} onClick={() => onNavigate('Projects')}><FolderKanban size={14} />{project.projectName}<Badge tone="neutral">{project.status}</Badge></button>) : <p>No projects assigned.</p>}</div>
        </section>
        <section className="panel profile-section"><SectionHeading title="Daily work log" action={<button className="text-button" onClick={() => onNavigate('Daily Work Log')}>View logs <ArrowUpRight size={14} /></button>} />{logs.length ? <div className="profile-history-list">{logs.slice(0, 4).map((log) => <div key={log.id}><time>{formatDate(log.date, { year: true })}</time><strong>{log.workCompleted}</strong>{log.contributions && <small>{log.contributions}</small>}</div>)}</div> : <p className="quiet-empty">No daily work entries yet.</p>}</section>
      </div>
      <div className="profile-side-col">
        <section className="panel profile-section"><SectionHeading title="Performance history" action={<button className="text-button" onClick={() => onNavigate('Performance History')}>All reviews <ArrowUpRight size={14} /></button>} />{reviews.length ? reviews.slice(0, 4).map((review) => <div className="review-mini" key={review.id}><div><strong>{review.periodLabel}</strong><small>{review.reviewType} review · Rating {Number(review.managerRating).toFixed(1)}/5</small></div><b>{review.overallScore}<small>%</small></b></div>) : <p className="quiet-empty">No reviews recorded.</p>}<button className="button-inline" onClick={() => onNavigate('Performance Review', person.id)}>Create review <Plus size={14} /></button></section>
        <section className="panel profile-section"><SectionHeading title="Events & history" />{events.length ? events.slice(0, 4).map((event) => <div className="history-event-row" key={event.id}><span><CalendarDays size={14} /></span><div><strong>{event.eventName}</strong><small>{formatDate(event.date)} · {event.status}</small></div></div>) : <p className="quiet-empty">No assigned events.</p>}</section>
        <section className="panel profile-section"><SectionHeading title="Manager notes" action={<button className="text-button" onClick={() => onNavigate('Manager Notes', person.id)}>Add note <Plus size={14} /></button>} />{notes.length ? notes.slice(0, 3).map((note) => <div className="private-note-mini" key={note.id}><MessageSquareText size={14} /><div><strong>{note.title}</strong><p>{note.body}</p><small>Private · {formatDate(note.createdAt)}</small></div></div>) : <p className="quiet-empty">No notes attached to this person.</p>}</section>
        <section className="panel profile-section"><SectionHeading title="Issues & leave" />{issues.length ? issues.slice(0, 2).map((issue) => <div className="history-event-row" key={issue.id}><span className={issue.status === 'Open' ? 'issue-icon-open' : ''}><ShieldAlert size={14} /></span><div><strong>{issue.issue}</strong><small>{issue.status} · {formatDate(issue.date)}</small></div></div>) : <p className="quiet-empty small-bottom">No issues recorded.</p>}{leaves.length ? <div className="leave-history-mini"><strong>Leave history</strong>{leaves.slice(0, 3).map((leave) => <small key={leave.id}>{formatDate(leave.leaveStart)} – {leave.actualReturn ? formatDate(leave.actualReturn) : `Expected ${formatDate(leave.expectedReturn)}`}{!leave.actualReturn && <Badge tone="amber">Current</Badge>}</small>)}</div> : <p className="quiet-empty">No leave records.</p>}</section>
      </div>
    </div>
  </div>;
}

export function WorkBoardView({ data: incoming, onAdd, onEdit, onSave }) {
  const data = { ...defaultData, ...incoming };
  const [personFilter, setPersonFilter] = useState('');
  const [department, setDepartment] = useState('All');
  const [role, setRole] = useState('All');
  const [priority, setPriority] = useState('All');
  const [due, setDue] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const roles = [...new Set(data.team.map((person) => person.role))];
  const visibleTasks = data.tasks.filter((task) => {
    if (personFilter && task.assignedTo !== personFilter) return false;
    if (department !== 'All' && task.department !== department) return false;
    if (role !== 'All' && task.role !== role) return false;
    if (priority !== 'All' && task.priority !== priority) return false;
    if (due === 'Overdue' && !(task.status !== 'Done' && isOverdue(task.dueDate))) return false;
    if (due === 'Today' && task.dueDate !== todayISO()) return false;
    if (due === 'Next 7 days' && !(task.dueDate >= todayISO() && task.dueDate <= shiftDate(todayISO(), 7))) return false;
    if (due === 'Custom date' && task.dueDate !== dateFilter) return false;
    return true;
  });
  const departmentOptions = [{ label: 'All', value: 'All' }, ...DEPARTMENTS.filter((departmentItem) => departmentItem !== 'Other').map((item) => ({ label: item === 'Research / Analyst' ? 'Research' : item, value: item }))];
  const clearFilters = () => { setPersonFilter(''); setDepartment('All'); setRole('All'); setPriority('All'); setDue('All'); setDateFilter(''); };
  return <div className="page-content work-board-page">
    <ViewIntro eyebrow="Work management" title="Work board" description="A manager’s view of ownership, delivery, and what needs a nudge." action={<Button icon={Plus} onClick={() => onAdd('tasks')}>New task</Button>} />
    <div className="board-controls"><div className="people-filter"><span>Assigned to</span><select value={personFilter} onChange={(event) => setPersonFilter(event.target.value)}><option value="">Everyone</option>{data.team.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></div><div className="filter-divider" /><div className="filter-chips board-dept-filters">{departmentOptions.map((item) => <button className={`filter-chip ${department === item.value ? 'active' : ''}`} key={item.value} onClick={() => setDepartment(item.value)}>{item.label}</button>)}</div><div className="filter-divider" /><label className="compact-filter"><span>Role</span><select value={role} onChange={(event) => setRole(event.target.value)}><option>All</option>{roles.map((item) => <option key={item}>{item}</option>)}</select></label><label className="compact-filter"><span>Priority</span><select value={priority} onChange={(event) => setPriority(event.target.value)}><option>All</option>{PRIORITIES.map((item) => <option key={item}>{item}</option>)}</select></label><label className="compact-filter"><span>Due date</span><select value={due} onChange={(event) => setDue(event.target.value)}><option>All</option><option>Today</option><option>Next 7 days</option><option>Overdue</option><option>Custom date</option></select></label>{due === 'Custom date' && <input className="date-filter-input" type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />}{(personFilter || department !== 'All' || role !== 'All' || priority !== 'All' || due !== 'All') && <button className="clear-filter" onClick={clearFilters}>Clear</button>}</div>
    <div className="board-summary"><span><strong>{visibleTasks.length}</strong> tasks shown</span><span>{data.tasks.filter((task) => task.status !== 'Done' && isOverdue(task.dueDate)).length} overdue across all departments</span></div>
    <div className="kanban-board">{TASK_STATUSES.map((status) => { const columnTasks = visibleTasks.filter((task) => task.status === status).sort((a, b) => compareDate(a.dueDate, b.dueDate)); return <section className={`kanban-column column-${status.toLowerCase().replaceAll(' ', '-')}`} key={status}><div className="kanban-column-header"><span className="kanban-status-dot" /><h3>{status === 'To Do' ? 'TO DO' : status.toUpperCase()}</h3><span className="kanban-count">{columnTasks.length}</span><button className="column-add" onClick={() => onAdd('tasks', { status })} aria-label={`Add task to ${status}`}><Plus size={16} /></button></div><div className="kanban-list">{columnTasks.map((task) => <TaskCard key={task.id} task={task} data={data} onEdit={onEdit} onMove={(item, nextStatus) => onSave('tasks', { ...item, status: nextStatus, progress: nextStatus === 'Done' ? 100 : item.progress })} />)}{!columnTasks.length && <div className="column-empty">No tasks in this stage</div>}</div></section>; })}</div>
  </div>;
}

function CalendarEventPill({ event, onClick }) {
  return <button className={`calendar-event-pill event-${event.status.toLowerCase().replaceAll(' ', '-')}`} onClick={(click) => { click.stopPropagation(); onClick(event); }}><span>{event.startTime || '—'}</span><strong>{event.eventName}</strong></button>;
}

export function ScheduleView({ data: incoming, mode = 'events', onAdd, onEdit, onSave }) {
  const data = { ...defaultData, ...incoming };
  const [view, setView] = useState(mode === 'calendar' ? 'Month' : 'Upcoming');
  const [cursor, setCursor] = useState(todayISO());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [department, setDepartment] = useState('All');
  const selectedDate = new Date(`${cursor}T12:00:00`);
  const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const firstDay = new Date(monthStart); firstDay.setDate(monthStart.getDate() - monthStart.getDay());
  const monthDays = Array.from({ length: 42 }, (_, index) => { const date = new Date(firstDay); date.setDate(firstDay.getDate() + index); return date.toISOString().slice(0, 10); });
  const weekStart = new Date(selectedDate); weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
  const weekDays = Array.from({ length: 7 }, (_, index) => { const date = new Date(weekStart); date.setDate(weekStart.getDate() + index); return date.toISOString().slice(0, 10); });
  const events = data.events.filter((event) => department === 'All' || event.department === department).sort((a, b) => compareDate(a.date, b.date));
  const eventsFor = (date) => events.filter((event) => event.date === date).sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  const shiftCursor = (amount) => {
    if (view === 'Month') {
      const date = new Date(`${cursor}T12:00:00`);
      date.setDate(1);
      date.setMonth(date.getMonth() + amount);
      setCursor(date.toISOString().slice(0, 10));
    } else setCursor(shiftDate(cursor, amount));
  };
  const currentMonthTitle = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(selectedDate);
  const displayEvents = view === 'Day' ? eventsFor(cursor) : view === 'Upcoming' ? events.filter((event) => event.date >= todayISO() && !['Completed', 'Cancelled'].includes(event.status)) : [];
  const closeDetail = () => setSelectedEvent(null);
  return <div className="page-content schedule-page">
    <ViewIntro eyebrow="Internal schedule" title={mode === 'calendar' ? 'Calendar' : 'Event schedule'} description="Team events and activities, with preparation and post-event records attached." action={<Button icon={Plus} onClick={() => onAdd('events')}>Schedule event</Button>} />
    <div className="schedule-toolbar"><div className="calendar-view-tabs">{['Month', 'Week', 'Day', 'Upcoming'].map((item) => <button key={item} className={view === item ? 'selected' : ''} onClick={() => setView(item)}>{item}</button>)}</div><div className="calendar-toolbar-right"><label className="compact-filter"><span>Department</span><select value={department} onChange={(event) => setDepartment(event.target.value)}><option>All</option>{DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}</select></label>{view !== 'Upcoming' && <div className="calendar-pager"><button onClick={() => shiftCursor(view === 'Month' ? -1 : view === 'Week' ? -7 : -1)} aria-label="Previous"><ArrowDown className="rotate-180" size={15} /></button><strong>{view === 'Month' ? currentMonthTitle : view === 'Week' ? `${formatDate(weekDays[0])} – ${formatDate(weekDays[6])}` : formatDate(cursor, { year: true })}</strong><button onClick={() => shiftCursor(view === 'Month' ? 1 : view === 'Week' ? 7 : 1)} aria-label="Next"><ArrowUp className="rotate-180" size={15} /></button><button className="today-button" onClick={() => setCursor(todayISO())}>Today</button></div>}</div></div>
    {view === 'Month' && <div className="calendar-month-wrap"><div className="calendar-month-grid calendar-headings">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-month-grid">{monthDays.map((date) => <button key={date} className={`calendar-day ${date.slice(0, 7) !== cursor.slice(0, 7) ? 'outside-month' : ''} ${date === todayISO() ? 'is-today' : ''} ${date === cursor ? 'is-selected' : ''}`} onClick={() => setCursor(date)}><span className="calendar-day-label">{Number(date.slice(-2))}</span>{eventsFor(date).slice(0, 2).map((event) => <CalendarEventPill key={event.id} event={event} onClick={setSelectedEvent} />)}{eventsFor(date).length > 2 && <span className="calendar-more">+{eventsFor(date).length - 2} more</span>}</button>)}</div></div>}
    {view === 'Week' && <div className="calendar-week-grid">{weekDays.map((date) => <div className={`calendar-week-day ${date === todayISO() ? 'is-today' : ''}`} key={date}><button className="calendar-week-title" onClick={() => { setCursor(date); setView('Day'); }}><span>{new Intl.DateTimeFormat('en', { weekday: 'short' }).format(new Date(`${date}T12:00:00`))}</span><strong>{Number(date.slice(-2))}</strong></button>{eventsFor(date).map((event) => <CalendarEventPill key={event.id} event={event} onClick={setSelectedEvent} />)}{!eventsFor(date).length && <span className="calendar-empty-day">—</span>}</div>)}</div>}
    {(view === 'Day' || view === 'Upcoming') && <div className="schedule-event-list">{displayEvents.map((event) => <button className="schedule-event-card" key={event.id} onClick={() => setSelectedEvent(event)}><div className="schedule-event-date"><strong>{new Intl.DateTimeFormat('en', { day: '2-digit' }).format(new Date(`${event.date}T12:00:00`))}</strong><span>{new Intl.DateTimeFormat('en', { month: 'short', weekday: 'short' }).format(new Date(`${event.date}T12:00:00`))}</span></div><div className="schedule-event-main"><div className="schedule-event-title"><h3>{event.eventName}</h3><Badge tone={event.status === 'Completed' ? 'success' : event.status === 'Cancelled' ? 'offline' : event.status === 'In Progress' ? 'blue' : 'purple'}>{event.status}</Badge></div><p>{event.description || 'No description yet.'}</p><div className="schedule-event-meta"><span><Clock3 size={14} />{event.startTime || 'Time TBD'}{event.endTime ? ` – ${event.endTime}` : ''} {event.timezone || ''}</span><span><UsersRound size={14} />{(event.assignedTeamMembers || []).length} assigned</span><span><MapPin size={14} />{event.platform || event.location || 'Location not set'}</span></div></div><ArrowUpRight size={17} /></button>)}{!displayEvents.length && <EmptyState icon={CalendarDays} title="No events in this view" description={view === 'Upcoming' ? 'Schedule an internal event to get started.' : 'There are no events for this date.'} action={<Button icon={Plus} onClick={() => onAdd('events')}>Schedule event</Button>} />}</div>}
    {selectedEvent && <EventDetails event={data.events.find((item) => item.id === selectedEvent.id) || selectedEvent} data={data} onClose={closeDetail} onEdit={(event) => { closeDetail(); onEdit('events', event); }} onSave={onSave} />}
  </div>;
}

function EventDetails({ event, data, onClose, onEdit, onSave }) {
  const relatedTasks = data.tasks.filter((task) => task.relatedEvent === event.id);
  const report = event.report || {};
  const togglePrep = (index) => {
    const checklist = (event.preparationTasks || []).map((item, itemIndex) => itemIndex === index ? { ...item, done: !item.done } : item);
    onSave('events', { ...event, preparationTasks: checklist });
  };
  return <Modal title={event.eventName} subtitle={`${event.eventType} · ${formatDate(event.date, { year: true })}`} onClose={onClose} size="large" className="event-detail-modal">
    <div className="event-detail-body"><div className="event-detail-overview"><Badge tone={event.status === 'Completed' ? 'success' : event.status === 'Cancelled' ? 'offline' : 'purple'}>{event.status}</Badge><p>{event.description || 'No event description.'}</p><div className="detail-grid"><div><span>Date & time</span><strong>{formatDate(event.date, { year: true })} · {event.startTime || 'TBD'}{event.endTime ? ` – ${event.endTime}` : ''} {event.timezone || ''}</strong></div><div><span>Organizer</span><strong>{event.organizer || 'Manager'}</strong></div><div><span>Platform / location</span><strong>{event.platform || '—'}{event.location ? ` · ${event.location}` : ''}</strong></div><div><span>Department</span><strong>{event.department || 'Cross-team'}</strong></div><div className="detail-wide"><span>Objective</span><strong>{event.objective || 'No objective recorded.'}</strong></div><div className="detail-wide"><span>Assigned people</span><div className="person-chip-list">{(event.assignedTeamMembers || []).length ? event.assignedTeamMembers.map((id) => { const person = data.team.find((member) => member.id === id); return person && <span key={id}><Avatar name={person.name} size="xs" />{person.name}</span>; }) : <strong>None assigned</strong>}</div></div></div></div>
      <div className="event-detail-columns"><section className="event-detail-box"><h3><ListChecks size={16} /> Preparation checklist</h3>{(event.preparationTasks || []).length ? event.preparationTasks.map((item, index) => <label className={`event-check-item ${item.done ? 'is-done' : ''}`} key={`${item.text}-${index}`}><input type="checkbox" checked={Boolean(item.done)} onChange={() => togglePrep(index)} /><span className="fake-check"><Check size={11} /></span><span>{item.text}</span><small>{item.assignedTo ? nameFor(item.assignedTo, data.team) : 'Unassigned'}</small></label>) : <p className="quiet-empty">No preparation items.</p>}</section><section className="event-detail-box"><h3><ClipboardCheck size={16} /> Related tasks</h3>{relatedTasks.length ? relatedTasks.map((task) => <div className="event-linked-task" key={task.id}><div><strong>{task.taskName}</strong><small>{nameFor(task.assignedTo, data.team)} · Due {formatDate(task.dueDate)}</small></div><TaskStatusBadge status={task.status} /></div>) : <p className="quiet-empty">No preparation tasks are linked yet.</p>}</section></div>
      {event.notes && <div className="event-notes"><span>Manager notes</span><p>{event.notes}</p></div>}
      {event.status === 'Completed' && <section className="event-report-card"><div className="event-report-head"><h3><FileText size={16} /> Event post-report</h3><Badge tone="success">Historical record</Badge></div>{event.report ? <div className="event-report-grid">{[['Actual participants', report.actualParticipants ?? '—'], ['Engagement', report.engagement || '—'], ['Overall rating', report.overallRating ? `${report.overallRating}/5` : '—'], ['Outcome', report.majorOutcome || '—'], ['What went well', report.whatWentWell || '—'], ['Problems', report.problems || '—'], ['Manager notes', report.managerNotes || '—'], ['Follow-up tasks', report.followUpTasks || '—']].map(([label, value]) => <div key={label}><span>{label}</span><p>{value}</p></div>)}</div> : <p className="quiet-empty">Complete the event report using Edit event.</p>}</section>}
      <div className="event-detail-footer"><span><History size={14} /> Event records are retained in activity and audit history.</span><Button variant="secondary" onClick={() => onEdit(event)}>Edit event / report</Button></div>
    </div>
  </Modal>;
}

export function WorkLogView({ data: incoming, onAdd, onEdit }) {
  const data = { ...defaultData, ...incoming };
  const [person, setPerson] = useState('All');
  const [date, setDate] = useState('');
  const logs = data.workLogs.filter((log) => (person === 'All' || log.personId === person) && (!date || log.date === date)).sort((a, b) => compareDate(b.date, a.date));
  return <div className="page-content"><ViewIntro eyebrow="Work records" title="Daily work log" description="Capture what each person completed, contributed, and still has in progress." action={<Button icon={Plus} onClick={() => onAdd('workLogs')}>Add work log</Button>} /><div className="list-filters"><label className="compact-filter"><span>Team member</span><select value={person} onChange={(event) => setPerson(event.target.value)}><option>All</option>{data.team.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label><label className="compact-filter"><span>Date</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><span className="list-result-count">{logs.length} work log{logs.length === 1 ? '' : 's'}</span></div><div className="log-card-list">{logs.map((log) => <article className="log-card" key={log.id}><div className="log-card-date"><strong>{new Intl.DateTimeFormat('en', { day: '2-digit' }).format(new Date(`${log.date}T12:00:00`))}</strong><span>{new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(`${log.date}T12:00:00`))}</span></div><div className="log-card-content"><div className="log-card-title"><div><Avatar name={nameFor(log.personId, data.team)} size="xs" /><strong>{nameFor(log.personId, data.team)}</strong><Badge tone="department">{log.department}</Badge></div><button className="row-action" onClick={() => onEdit('workLogs', log)}>Edit</button></div><p>{log.workCompleted}</p><div className="log-detail-grid">{log.contributions && <div><span>Important contributions</span><p>{log.contributions}</p></div>}{log.problems && <div><span>Problems</span><p>{log.problems}</p></div>}{log.pendingWork && <div><span>Pending work</span><p>{log.pendingWork}</p></div>}{log.managerNotes && <div><span>Manager notes</span><p>{log.managerNotes}</p></div>}</div>{log.tasksCompleted?.length > 0 && <small className="log-task-count"><ClipboardCheck size={13} /> {log.tasksCompleted.length} linked completed task{log.tasksCompleted.length === 1 ? '' : 's'}</small>}</div></article>)}{!logs.length && <EmptyState icon={FileText} title="No daily work logs found" description="Record a short daily summary to keep the person’s history complete." action={<Button icon={Plus} onClick={() => onAdd('workLogs')}>Add work log</Button>} />}</div></div>;
}

export function ProjectsView({ data: incoming, onAdd, onEdit, onNavigate }) {
  const data = { ...defaultData, ...incoming };
  return <div className="page-content"><ViewIntro eyebrow="Portfolio" title="Projects" description="Group tasks, owners, and deadlines into manager-owned projects." action={<Button icon={Plus} onClick={() => onAdd('projects')}>New project</Button>} /><div className="project-grid">{data.projects.map((project) => { const tasks = data.tasks.filter((task) => task.relatedProject === project.id); const completed = tasks.filter((task) => task.status === 'Done').length; return <article className="project-card" key={project.id}><div className="project-card-top"><span className="project-icon"><FolderKanban size={18} /></span><button className="row-action" onClick={() => onEdit('projects', project)}>Edit</button></div><div className="project-card-title"><h3>{project.projectName}</h3><Badge tone={project.status === 'Completed' ? 'success' : project.status === 'On Hold' ? 'amber' : 'blue'}>{project.status}</Badge></div><p>{project.description || 'No project description.'}</p><div className="project-progress"><div><span>Task progress</span><strong>{tasks.length ? Math.round((completed / tasks.length) * 100) : 0}%</strong></div><div className="progress-track"><i style={{ width: `${tasks.length ? Math.round((completed / tasks.length) * 100) : 0}%` }} /></div><small>{completed} of {tasks.length} tasks complete</small></div><div className="project-people"><div className="avatar-stack">{(project.teamMembers || []).slice(0, 4).map((id) => { const member = data.team.find((person) => person.id === id); return member && <Avatar key={id} name={member.name} size="xs" />; })}{(project.teamMembers || []).length > 4 && <span className="avatar-more">+{project.teamMembers.length - 4}</span>}</div><span>{project.teamMembers?.length || 0} team members</span></div><div className="project-footer"><span><CalendarDays size={14} />Due {formatDate(project.deadline)}</span><button className="text-button" onClick={() => onNavigate('Work Board')}>View tasks <ArrowUpRight size={14} /></button></div></article>; })}{!data.projects.length && <EmptyState icon={FolderKanban} title="No projects yet" description="Create a project and connect tasks to it from the Work Board." action={<Button icon={Plus} onClick={() => onAdd('projects')}>New project</Button>} />}</div></div>;
}

export function MeetingsView({ data: incoming, onAdd, onEdit }) {
  const data = { ...defaultData, ...incoming };
  const meetings = [...data.meetings].sort((a, b) => compareDate(a.date, b.date));
  return <div className="page-content"><ViewIntro eyebrow="Internal schedule" title="Meetings" description="Team, department, 1-on-1, review, and partner meetings with action items." action={<Button icon={Plus} onClick={() => onAdd('meetings')}>Schedule meeting</Button>} /><div className="meeting-list">{meetings.map((meeting) => <article className="meeting-card" key={meeting.id}><div className="meeting-date"><strong>{new Intl.DateTimeFormat('en', { day: '2-digit' }).format(new Date(`${meeting.date}T12:00:00`))}</strong><span>{new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(`${meeting.date}T12:00:00`))}</span></div><div className="meeting-details"><div className="meeting-title-row"><h3>{meeting.meetingName}</h3><Badge tone="purple">{meeting.meetingType}</Badge><button className="row-action" onClick={() => onEdit('meetings', meeting)}>Edit</button></div><div className="meeting-meta"><span><Clock3 size={14} />{meeting.time || 'Time TBD'}</span><span><UsersRound size={14} />{(meeting.participants || []).map((id) => nameFor(id, data.team)).join(', ') || 'No participants selected'}</span><span><Flag size={14} />{meeting.followUpDate ? `Follow-up ${formatDate(meeting.followUpDate)}` : 'No follow-up date'}</span></div>{meeting.agenda && <p>{meeting.agenda}</p>}{meeting.actionItems?.length > 0 && <div className="meeting-action-items"><strong>Action items</strong>{meeting.actionItems.map((item, index) => <span className={item.done ? 'done' : ''} key={`${item.text}-${index}`}><i>{item.done ? '✓' : '·'}</i>{item.text}{item.assignedTo && <small> · {nameFor(item.assignedTo, data.team)}</small>}</span>)}</div>}</div></article>)}{!meetings.length && <EmptyState icon={UsersRound} title="No meetings scheduled" description="Add a manager-organized meeting with participants, agenda, and follow-up actions." action={<Button icon={Plus} onClick={() => onAdd('meetings')}>Schedule meeting</Button>} />}</div></div>;
}

export function PerformanceView({ data: incoming, mode = 'review', initialPersonId = '', onAdd, onEdit }) {
  const data = { ...defaultData, ...incoming };
  const [personFilter, setPersonFilter] = useState(initialPersonId || 'All');
  const [department, setDepartment] = useState('All');
  const people = data.team.filter((person) => (personFilter === 'All' || person.id === personFilter) && (department === 'All' || person.department === department));
  const reviews = [...data.reviews].filter((review) => (personFilter === 'All' || review.personId === personFilter) && (department === 'All' || data.team.find((person) => person.id === review.personId)?.department === department)).sort((a, b) => compareDate(b.periodEnd, a.periodEnd));
  const departmentRows = DEPARTMENTS.filter((item) => item !== 'Other').map((item) => ({ name: item, ...departmentMetrics(data, item) }));
  const averageScore = people.length ? Math.round(people.reduce((sum, person) => sum + Number(person.currentScore || 0), 0) / people.length) : 0;
  const trendPeople = personFilter === 'All' ? data.team.slice(0, 4) : data.team.filter((person) => person.id === personFilter);
  const title = mode === 'history' ? 'Performance history' : 'Performance review';
  const description = mode === 'history' ? 'Historical reviews stay on record and show the team’s progress over time.' : 'Review individuals weekly, monthly, or quarterly using recorded work data and Manager assessment.';
  return <div className="page-content"><ViewIntro eyebrow="People performance" title={title} description={description} action={mode === 'history' ? null : <Button icon={Plus} onClick={() => onAdd('reviews', initialPersonId ? { personId: initialPersonId } : null)}>Create review</Button>} />
    <div className="performance-toolbar"><label className="compact-filter"><span>Team member</span><select value={personFilter} onChange={(event) => setPersonFilter(event.target.value)}><option>All</option>{data.team.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label><label className="compact-filter"><span>Department</span><select value={department} onChange={(event) => setDepartment(event.target.value)}><option>All</option>{DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}</select></label><span className="performance-summary-chip"><TrendingUp size={15} /> Average score <strong>{averageScore}%</strong></span><span className="performance-summary-chip"><History size={15} /> {reviews.length} saved review{reviews.length === 1 ? '' : 's'}</span></div>
    <section className="panel department-performance-panel"><SectionHeading title="Department performance" note="Workload and current score by department" />{departmentRows.map((row) => <div className="department-performance-row" key={row.name}><div className="department-performance-name"><span className="dept-color-dot" data-dept={row.name} /><strong>{row.name}</strong></div><span>{row.teamSize} members</span><div className="department-score"><strong>{row.averagePerformance}%</strong><div className="progress-track"><i style={{ width: `${row.averagePerformance}%` }} /></div></div><span>{row.tasksCompleted} completed</span><span>{row.pendingTasks} pending</span><span className={row.overdueTasks ? 'overdue-text' : ''}>{row.overdueTasks} overdue</span></div>)}</section>
    <section className="panel performance-trend-panel"><SectionHeading title="Performance trend" note="Individual review scores over time" /><div className="trend-people-grid">{trendPeople.map((person) => { const history = data.reviews.filter((review) => review.personId === person.id).sort((a, b) => compareDate(a.periodEnd, b.periodEnd)).slice(-5); return <div className="trend-person-card" key={person.id}><div className="trend-person-heading"><Avatar name={person.name} size="xs" /><div><strong>{person.name}</strong><small>{person.department}</small></div><b>{Number(person.currentScore || 0)}%</b></div>{history.length ? <div className="trend-bars">{history.map((review) => <div key={review.id} title={`${review.periodLabel}: ${review.overallScore}%`}><i style={{ height: `${Math.max(8, Math.min(100, Number(review.overallScore) || 0))}%` }} /><small>{(review.periodLabel || '').slice(0, 3)}</small></div>)}</div> : <div className="trend-no-history">No historical scores yet · latest {Number(person.currentScore || 0)}%</div>}</div>; })}{!trendPeople.length && <p className="quiet-empty">No team records to trend.</p>}</div></section>
    <div className="review-layout"><section className="panel review-history-panel"><SectionHeading title={mode === 'history' ? 'Review history' : 'Recent reviews'} note="Each review is retained as a dated snapshot" />{reviews.length ? <div className="review-table-wrap"><table className="data-table review-table"><thead><tr><th>Team member</th><th>Review period</th><th>Tasks</th><th>Completion</th><th>Score</th><th>Rating</th><th /></tr></thead><tbody>{reviews.map((review) => { const person = data.team.find((member) => member.id === review.personId); const metrics = review.metrics || {}; return <tr key={review.id}><td><div className="person-cell"><Avatar name={person?.name || 'Member'} size="xs" /><span><strong>{person?.name || 'Archived member'}</strong><small>{person?.department || '—'}</small></span></div></td><td><strong>{review.periodLabel}</strong><small className="subcell">{review.reviewType} · {formatDate(review.periodStart)} – {formatDate(review.periodEnd)}</small></td><td>{metrics.tasksCompleted ?? 0} / {metrics.tasksAssigned ?? 0}</td><td><div className="score-cell"><strong>{metrics.completionRate ?? 0}%</strong><div><i style={{ width: `${metrics.completionRate || 0}%` }} /></div></div></td><td><span className={`score-pill ${Number(review.overallScore) >= 90 ? 'score-excellent' : Number(review.overallScore) >= 75 ? 'score-good' : 'score-low'}`}>{review.overallScore}</span></td><td>{Number(review.managerRating).toFixed(1)} / 5</td><td><button className="row-action" onClick={() => onEdit('reviews', review)}>View</button></td></tr>; })}</tbody></table></div> : <EmptyState icon={TrendingUp} title="No reviews match" description="Choose a different filter or create the first review for a team member." action={<Button icon={Plus} onClick={() => onAdd('reviews', initialPersonId ? { personId: initialPersonId } : null)}>Create review</Button>} />}</section>
      <section className="panel review-due-panel"><SectionHeading title="Review due" note="A review cadence reminder" />{people.map((person) => { const latest = data.reviews.filter((review) => review.personId === person.id).sort((a, b) => compareDate(b.periodEnd, a.periodEnd))[0]; const due = !latest || !latest.periodEnd || latest.periodEnd < shiftDate(todayISO(), -28); return <div className="review-due-row" key={person.id}><Avatar name={person.name} size="xs" /><div><strong>{person.name}</strong><small>{latest ? `Last review ${latest.periodLabel}` : 'No review on file'}</small></div>{due && <Badge tone="amber">Due</Badge>}</div>; })}{!people.length && <p className="quiet-empty">No team members in this filter.</p>}</section></div>
    {mode !== 'history' && <div className="performance-note"><Activity size={15} /> Metrics are calculated from recorded tasks, projects, events, issues, and work logs. The score and Manager assessment are entered by you.</div>}
  </div>;
}

export function LeaveView({ data: incoming, onAdd, onEdit, onSave }) {
  const data = { ...defaultData, ...incoming };
  const [tab, setTab] = useState('Current');
  const active = data.leaves.filter((leave) => !leave.actualReturn).sort((a, b) => compareDate(a.expectedReturn, b.expectedReturn));
  const past = data.leaves.filter((leave) => leave.actualReturn).sort((a, b) => compareDate(b.leaveStart, a.leaveStart));
  const rows = tab === 'Current' ? active : past;
  async function returnToWork(leave) {
    const today = todayISO();
    await onSave('leaves', { ...leave, actualReturn: today });
  }
  return <div className="page-content"><ViewIntro eyebrow="Availability management" title="Leave records" description="Employee availability remains Active or Offline. Leave is a separate, permanent history record." action={<Button icon={Plus} onClick={() => onAdd('leaves')}>Record leave</Button>} /><div className="leave-tabs"><button className={tab === 'Current' ? 'active' : ''} onClick={() => setTab('Current')}>Current leave <span>{active.length}</span></button><button className={tab === 'History' ? 'active' : ''} onClick={() => setTab('History')}>Leave history <span>{past.length}</span></button></div><div className="table-card"><div className="table-scroll"><table className="data-table leave-table"><thead><tr><th>Person</th><th>Department</th><th>Leave start</th><th>Expected return</th><th>Actual return</th><th>Reason / note</th><th>Status</th><th /></tr></thead><tbody>{rows.map((leave) => { const person = data.team.find((member) => member.id === leave.personId); return <tr key={leave.id}><td><div className="person-cell"><Avatar name={person?.name || 'Member'} size="xs" /><span><strong>{person?.name || 'Archived member'}</strong><small>{person?.role || '—'}</small></span></div></td><td>{person?.department || '—'}</td><td>{formatDate(leave.leaveStart)}</td><td>{formatDate(leave.expectedReturn)}</td><td>{formatDate(leave.actualReturn)}</td><td className="reason-cell">{leave.reason || leave.managerNote || '—'}</td><td><Badge tone={leave.actualReturn ? 'neutral' : 'amber'} dot>{leave.actualReturn ? 'Returned' : 'On leave'}</Badge></td><td><div className="table-actions"><button className="row-action" onClick={() => onEdit('leaves', leave)}>Edit</button>{!leave.actualReturn && <button className="row-action row-action-green" onClick={() => returnToWork(leave)}>Mark returned</button>}</div></td></tr>; })}</tbody></table></div>{!rows.length && <EmptyState icon={CalendarDays} title={tab === 'Current' ? 'No current leave' : 'No leave history'} description={tab === 'Current' ? 'Everyone is available or no leave has been recorded.' : 'Completed leave records will remain listed here.'} action={tab === 'Current' ? <Button icon={Plus} onClick={() => onAdd('leaves')}>Record leave</Button> : null} />}</div></div>;
}

export function IssuesView({ data: incoming, onAdd, onEdit }) {
  const data = { ...defaultData, ...incoming };
  const [tab, setTab] = useState('Open');
  const rows = data.issues.filter((issue) => issue.status === tab).sort((a, b) => compareDate(b.date, a.date));
  return <div className="page-content"><ViewIntro eyebrow="Risk and escalation management" title="Issues & escalations" description="Document the person, action, resolution, and any follow-up. Issue status is separate from team availability." action={<Button icon={Plus} onClick={() => onAdd('issues')}>Log issue</Button>} /><div className="management-tabs"><button className={tab === 'Open' ? 'active' : ''} onClick={() => setTab('Open')}>Open <span>{data.issues.filter((issue) => issue.status === 'Open').length}</span></button><button className={tab === 'Resolved' ? 'active' : ''} onClick={() => setTab('Resolved')}>Resolved <span>{data.issues.filter((issue) => issue.status === 'Resolved').length}</span></button></div><div className="issue-list">{rows.map((issue) => <article className="issue-card" key={issue.id}><div className={`issue-marker ${issue.status === 'Resolved' ? 'resolved' : ''}`}><ShieldAlert size={17} /></div><div className="issue-main"><div className="issue-title-row"><h3>{issue.issue}</h3><PriorityBadge priority={issue.priority} /><Badge tone={issue.status === 'Open' ? 'amber' : 'success'}>{issue.status}</Badge></div><div className="issue-meta"><span>{nameFor(issue.personId, data.team)}</span><span>{issue.department || 'No department'}</span><span>{formatDate(issue.date)}</span></div><p>{issue.description || 'No description provided.'}</p>{issue.actionTaken && <div className="issue-action"><strong>Action taken</strong><p>{issue.actionTaken}</p></div>}{issue.resolution && <div className="issue-action"><strong>Resolution</strong><p>{issue.resolution}</p></div>}{issue.followUp && <div className="issue-followup"><Flag size={14} /><span>{issue.followUp}</span></div>}</div><button className="row-action" onClick={() => onEdit('issues', issue)}>Edit</button></article>)}{!rows.length && <EmptyState icon={ShieldAlert} title={`No ${tab.toLowerCase()} issues`} description="Log an escalation or management issue to retain its history." action={<Button icon={Plus} onClick={() => onAdd('issues')}>Log issue</Button>} />}</div></div>;
}

export function FollowUpsView({ data: incoming, onAdd, onEdit, onSave }) {
  const data = { ...defaultData, ...incoming };
  const [tab, setTab] = useState('Pending');
  const rows = data.followUps.filter((item) => item.status === tab).sort((a, b) => compareDate(a.dueDate, b.dueDate));
  return <div className="page-content"><ViewIntro eyebrow="Manager action queue" title="Follow-ups" description="Keep promises, coaching actions, and important check-ins from falling through the cracks." action={<Button icon={Plus} onClick={() => onAdd('followUps')}>Add follow-up</Button>} /><div className="followup-summary-row">{[['Pending', data.followUps.filter((item) => item.status === 'Pending').length], ['Due today', data.followUps.filter((item) => item.status === 'Pending' && item.dueDate === todayISO()).length], ['Overdue', data.followUps.filter((item) => item.status === 'Pending' && isOverdue(item.dueDate)).length], ['Completed', data.followUps.filter((item) => item.status === 'Completed').length]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className="management-tabs"><button className={tab === 'Pending' ? 'active' : ''} onClick={() => setTab('Pending')}>Pending <span>{data.followUps.filter((item) => item.status === 'Pending').length}</span></button><button className={tab === 'Completed' ? 'active' : ''} onClick={() => setTab('Completed')}>Completed <span>{data.followUps.filter((item) => item.status === 'Completed').length}</span></button></div><div className="followup-list">{rows.map((item) => <article className={`followup-card ${isOverdue(item.dueDate) && item.status === 'Pending' ? 'followup-overdue' : ''}`} key={item.id}><button className={`followup-check ${item.status === 'Completed' ? 'completed' : ''}`} aria-label={item.status === 'Completed' ? 'Mark pending' : 'Mark completed'} onClick={() => onSave('followUps', { ...item, status: item.status === 'Completed' ? 'Pending' : 'Completed' })}>{item.status === 'Completed' ? <Check size={15} /> : null}</button><div className="followup-main"><div className="followup-title-row"><h3>{item.followUp}</h3><PriorityBadge priority={item.priority} /></div><div className="followup-meta"><span><UsersRound size={13} />{nameFor(item.personId, data.team)}</span><span>{item.department || 'All'}</span>{item.dueDate && <span className={isOverdue(item.dueDate) && item.status === 'Pending' ? 'overdue-text' : ''}><CalendarDays size={13} />Due {formatDate(item.dueDate)}</span>}{item.relatedTask && <span><ClipboardCheck size={13} />{data.tasks.find((task) => task.id === item.relatedTask)?.taskName || 'Related task'}</span>}</div>{item.notes && <p>{item.notes}</p>}</div><button className="row-action" onClick={() => onEdit('followUps', item)}>Edit</button></article>)}{!rows.length && <EmptyState icon={Flag} title={`No ${tab.toLowerCase()} follow-ups`} description="Add one to keep a person, task, or event on your manager action list." action={<Button icon={Plus} onClick={() => onAdd('followUps')}>Add follow-up</Button>} />}</div></div>;
}

export function NotesView({ data: incoming, initialPersonId = '', onAdd, onEdit }) {
  const data = { ...defaultData, ...incoming };
  const [targetType, setTargetType] = useState(initialPersonId ? 'Person' : 'All');
  const [query, setQuery] = useState('');
  const notes = [...data.notes].filter((note) => (targetType === 'All' || note.targetType === targetType) && (!initialPersonId || targetType !== 'Person' || note.targetId === initialPersonId) && `${note.title} ${note.body}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || new Date(b.createdAt) - new Date(a.createdAt));
  const targetLabel = (note) => {
    if (note.targetType === 'Person') return nameFor(note.targetId, data.team);
    if (note.targetType === 'Task') return data.tasks.find((task) => task.id === note.targetId)?.taskName || 'Task';
    if (note.targetType === 'Project') return data.projects.find((project) => project.id === note.targetId)?.projectName || 'Project';
    if (note.targetType === 'Event') return data.events.find((event) => event.id === note.targetId)?.eventName || 'Event';
    return note.targetId || note.department || note.targetType;
  };
  return <div className="page-content"><ViewIntro eyebrow="Private management records" title="Manager notes" description="Notes are only available to authenticated Manager accounts and can be attached to any working record." action={<Button icon={Plus} onClick={() => onAdd('notes', initialPersonId ? { targetType: 'Person', targetId: initialPersonId, pinned: false } : null)}>Add private note</Button>} /><div className="notes-toolbar"><div className="filter-chips">{['All', 'Person', 'Task', 'Project', 'Event', 'Department', 'Performance Review'].map((type) => <button key={type} className={`filter-chip ${targetType === type ? 'active' : ''}`} onClick={() => setTargetType(type)}>{type}</button>)}</div><label className="inline-search"><Search size={15} /><input placeholder="Search private notes" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div><div className="notes-grid">{notes.map((note) => <article className={`note-card ${note.pinned ? 'is-pinned' : ''}`} key={note.id}><div className="note-card-top"><span className="note-icon"><MessageSquareText size={17} /></span>{note.pinned && <Badge tone="purple">Pinned</Badge>}<button className="row-action" onClick={() => onEdit('notes', note)}>Edit</button></div><h3>{note.title}</h3><p>{note.body}</p><div className="note-target"><Badge tone="department">{note.targetType}</Badge><strong>{targetLabel(note)}</strong></div><small className="note-date">{formatDate(note.createdAt, { year: true })} · Private to Manager</small></article>)}{!notes.length && <EmptyState icon={MessageSquareText} title="No private notes found" description="Create a note and attach it to a person, project, task, event, department, or review." action={<Button icon={Plus} onClick={() => onAdd('notes', initialPersonId ? { targetType: 'Person', targetId: initialPersonId, pinned: false } : null)}>Add private note</Button>} />}</div></div>;
}

function reportDateRange(type) {
  const today = todayISO();
  if (type === 'Daily Team Report') return { from: today, to: today };
  if (type === 'Weekly Team Report') {
    const weekday = new Date(`${today}T12:00:00`).getDay();
    const mondayOffset = (weekday + 6) % 7;
    return { from: shiftDate(today, -mondayOffset), to: shiftDate(today, 6 - mondayOffset) };
  }
  if (type === 'Monthly Team Report') {
    const [year, month] = today.split('-').map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    return { from: `${today.slice(0, 7)}-01`, to: `${today.slice(0, 7)}-${String(lastDay).padStart(2, '0')}` };
  }
  return { from: '', to: '' };
}

export function ReportsView({ data: incoming, initialType = 'Daily Team Report' }) {
  const data = { ...defaultData, ...incoming };
  const [type, setType] = useState(initialType);
  const [department, setDepartment] = useState('All');
  const [personId, setPersonId] = useState('');
  const defaultRange = reportDateRange(initialType);
  const [from, setFrom] = useState(defaultRange.from);
  const [to, setTo] = useState(defaultRange.to);
  const [ran, setRan] = useState(false);
  const title = initialType.startsWith('Daily') ? 'Daily reports' : initialType.startsWith('Weekly') ? 'Weekly reports' : 'Monthly reports';
  const rows = useMemo(() => buildReportRows(type, data, { department, personId, from, to }), [type, data, department, personId, from, to]);
  const columns = rows.length ? Object.keys(rows[0]) : [];
  const filterOut = (row) => (!department || department === 'All' || row.Department === department) && (!personId || row.Person === nameFor(personId, data.team));
  const exportRows = rows.filter(filterOut);
  const download = (fileName, content, mime) => { const blob = new Blob([content], { type: mime }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = fileName; link.click(); URL.revokeObjectURL(url); };
  const csv = () => { const keys = exportRows.length ? Object.keys(exportRows[0]) : columns; const body = [keys.map((key) => `"${key.replaceAll('"', '""')}"`).join(','), ...exportRows.map((row) => keys.map((key) => `"${String(row[key] ?? '').replaceAll('"', '""')}"`).join(','))].join('\n'); download(`${type.toLowerCase().replaceAll(' ', '-')}.csv`, body, 'text/csv;charset=utf-8;'); };
  const excel = () => { const keys = exportRows.length ? Object.keys(exportRows[0]) : columns; const html = `<html><head><meta charset="utf-8"></head><body><table><thead><tr>${keys.map((key) => `<th>${escapeHtml(key)}</th>`).join('')}</tr></thead><tbody>${exportRows.map((row) => `<tr>${keys.map((key) => `<td>${escapeHtml(row[key])}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`; download(`${type.toLowerCase().replaceAll(' ', '-')}.xls`, html, 'application/vnd.ms-excel'); };
  const run = () => setRan(true);
  return <div className="page-content reports-page"><ViewIntro eyebrow="Manager reporting" title={title} description="Build operational reports from your team, task, event, leave, project, issue, and daily work records." action={<div className="report-export-actions"><Button variant="secondary" icon={Download} onClick={csv}>CSV</Button><Button variant="secondary" icon={Download} onClick={excel}>Excel</Button><Button variant="secondary" icon={FileText} onClick={() => window.print()}>PDF</Button></div>} />
    <section className="panel report-builder"><div className="report-builder-title"><div><span className="report-builder-icon"><Filter size={17} /></span><div><h3>Report builder</h3><p>Filters apply to the table and every export format.</p></div></div><Button onClick={run}>Generate report</Button></div><div className="report-filter-grid"><label className="form-field"><span className="field-label">Report type</span><select value={type} onChange={(event) => { setType(event.target.value); setRan(false); }}><optgroup label="Team summaries">{REPORT_TYPES.slice(0, 5).map((item) => <option key={item}>{item}</option>)}</optgroup><optgroup label="Operational records">{REPORT_TYPES.slice(5).map((item) => <option key={item}>{item}</option>)}</optgroup></select></label><label className="form-field"><span className="field-label">Department</span><select value={department} onChange={(event) => setDepartment(event.target.value)}><option>All</option>{DEPARTMENTS.map((item) => <option key={item}>{item}</option>)}</select></label><label className="form-field"><span className="field-label">Team member</span><select value={personId} onChange={(event) => setPersonId(event.target.value)}><option value="">Everyone</option>{data.team.map((person) => <option value={person.id} key={person.id}>{person.name}</option>)}</select></label><label className="form-field"><span className="field-label">From date</span><input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label><label className="form-field"><span className="field-label">To date</span><input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label></div></section>
    <section className="panel report-result-panel" id="report-print"><div className="report-result-header"><div><div className="eyebrow">{ran ? 'Generated report' : 'Live preview'}</div><h3>{type}</h3><p>{department !== 'All' ? department : 'All departments'}{from || to ? ` · ${from ? formatDate(from) : 'Any date'} – ${to ? formatDate(to) : 'Any date'}` : ''}{personId ? ` · ${nameFor(personId, data.team)}` : ''}</p></div><span className="record-count">{exportRows.length} record{exportRows.length === 1 ? '' : 's'}</span></div><div className="table-scroll"><table className="data-table report-table"><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{exportRows.map((row, rowIndex) => <tr key={rowIndex}>{columns.map((column) => <td key={column}>{String(row[column] ?? '—')}</td>)}</tr>)}</tbody></table></div>{!exportRows.length && <div className="report-empty"><FileText size={20} /><strong>No records match the selected filters.</strong><span>Adjust the department, person, or date range, then generate again.</span></div>}</section>
    <div className="report-export-note"><ShieldAlert size={14} />PDF opens the browser print dialog. Excel exports a spreadsheet-compatible .xls file; CSV is UTF-8.</div>
  </div>;
}
function escapeHtml(value) { return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;'); }

export function ActivityView({ data: incoming, audit = false }) {
  const data = { ...defaultData, ...incoming };
  const [query, setQuery] = useState('');
  const records = audit ? data.audit : data.activity;
  const visibleRows = records.filter((entry) => `${entry.message || ''} ${entry.details || ''} ${entry.actor || ''} ${entry.entityType || ''}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="page-content"><ViewIntro eyebrow="System history" title={audit ? 'Audit log' : 'Activity history'} description={audit ? 'A durable manager-only record of who changed what, with prior and new values.' : 'A chronological record of important operations and manager actions.'} action={<label className="inline-search"><Search size={15} /><input placeholder="Search history" value={query} onChange={(event) => setQuery(event.target.value)} /></label>} />
    {audit ? <div className="table-card"><div className="table-scroll"><table className="data-table audit-table"><thead><tr><th>Change</th><th>Record</th><th>Actor</th><th>Old value</th><th>New value</th><th>Date & time</th></tr></thead><tbody>{visibleRows.map((entry) => <tr key={entry.id}><td><strong>{entry.details}</strong><small className="subcell">{entry.action}</small></td><td><Badge tone="department">{entry.entityType}</Badge></td><td>{entry.actor || 'Manager'}</td><td><AuditValues value={entry.oldValue} /></td><td><AuditValues value={entry.newValue} /></td><td>{formatDateTime(entry.timestamp)}</td></tr>)}</tbody></table></div>{!visibleRows.length && <EmptyState icon={History} title="No audit entries yet" description="Important changes are logged automatically when you manage records." />}</div> : <div className="activity-page-list">{visibleRows.map((entry) => <article className="activity-page-row" key={entry.id}><div className="activity-page-icon"><Activity size={16} /></div><div className="activity-page-text"><strong>{entry.message}</strong><span>{entry.actor || 'Manager'} · {formatDateTime(entry.timestamp)}</span></div><Badge tone="department">{entry.entityType || 'Workspace'}</Badge></article>)}{!visibleRows.length && <EmptyState icon={Activity} title="No activity found" description="New tasks, events, reviews, and changes will appear here." />}</div>}
  </div>;
}
function AuditValues({ value }) {
  if (!value || !Object.keys(value).length) return <span className="muted">—</span>;
  const entries = Object.entries(value).slice(0, 4);
  const display = (item) => item == null || item === '' ? '—' : Array.isArray(item) ? item.map((entry) => typeof entry === 'object' ? entry.text || '' : entry).join(', ') : typeof item === 'object' ? JSON.stringify(item) : String(item);
  return <div className="audit-values">{entries.map(([key, item]) => <span key={key}><b>{key}</b>: {display(item)}</span>)}{Object.keys(value).length > 4 && <small>+{Object.keys(value).length - 4} more</small>}</div>;
}

export function SettingsView({ onCreateManager, onChangePassword }) {
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submitManager(event) {
    event.preventDefault(); setMessage(''); setError(''); setBusy(true);
    try { await onCreateManager(managerEmail, managerPassword); setMessage('Manager account created. Share access securely outside this dashboard.'); setManagerEmail(''); setManagerPassword(''); }
    catch (exception) { setError(exception.message); }
    finally { setBusy(false); }
  }
  async function submitPassword(event) {
    event.preventDefault(); setMessage(''); setError('');
    if (newPassword !== confirmPassword) return setError('New password and confirmation do not match.');
    setBusy(true);
    try { await onChangePassword(currentPassword, newPassword); setMessage('Password changed successfully.'); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }
    catch (exception) { setError(exception.message); }
    finally { setBusy(false); }
  }
  return <div className="page-content"><ViewIntro eyebrow="Private workspace" title="Settings" description="Manager access and workspace security. Only Manager accounts can enter this control center." />
    <div className="settings-grid"><section className="panel settings-card"><div className="settings-card-head"><span className="settings-icon"><UsersRound size={17} /></span><div><h3>Create Manager account</h3><p>Additional access is provisioned by an authenticated Manager. No team-member logins are created.</p></div></div><form className="settings-form" onSubmit={submitManager}><label className="form-field"><span className="field-label">Manager email</span><input type="email" value={managerEmail} onChange={(event) => setManagerEmail(event.target.value)} required autoComplete="off" /></label><label className="form-field"><span className="field-label">Temporary password</span><input type="password" value={managerPassword} onChange={(event) => setManagerPassword(event.target.value)} minLength={12} required autoComplete="new-password" /><small>Use at least 12 characters. Passwords are stored as salted hashes.</small></label><Button type="submit" icon={Plus} disabled={busy}>{busy ? 'Creating…' : 'Create Manager account'}</Button></form></section>
      <section className="panel settings-card"><div className="settings-card-head"><span className="settings-icon settings-icon-purple"><ShieldAlert size={17} /></span><div><h3>Change your password</h3><p>Choose a unique password. Passwords are never shown in workspace records.</p></div></div><form className="settings-form" onSubmit={submitPassword}><label className="form-field"><span className="field-label">Current password</span><input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required autoComplete="current-password" /></label><label className="form-field"><span className="field-label">New password</span><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={12} required autoComplete="new-password" /></label><label className="form-field"><span className="field-label">Confirm new password</span><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={12} required autoComplete="new-password" /></label><Button type="submit" icon={ShieldAlert} disabled={busy}>{busy ? 'Updating…' : 'Update password'}</Button></form></section>
      {(message || error) && <div className={`settings-feedback ${error ? 'feedback-error' : 'feedback-success'}`}>{error || message}</div>}
      <section className="panel security-note"><span><ShieldAlert size={17} /></span><div><strong>Private by design</strong><p>This dashboard has one permission level: Manager. Team records, reviews, notes, reports, and audit history require an authenticated manager session. Do not share accounts or passwords in notes or task descriptions.</p></div></section>
      <section className="panel settings-info"><div className="settings-card-head"><span className="settings-icon settings-icon-mint"><Activity size={17} /></span><div><h3>Operational recordkeeping</h3><p>All manager-maintained records persist locally with an activity trail.</p></div></div><ul><li><Check size={15} />Task updates preserve task history and audit changes.</li><li><Check size={15} />Performance reviews and leave records are retained as historical entries.</li><li><Check size={15} />The app stores no community engagement or member-growth analytics.</li></ul></section>
    </div>
  </div>;
}
