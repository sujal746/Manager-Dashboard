import React from 'react';
import { Activity, Clock3, FileText, History, ShieldCheck } from 'lucide-react';
import { Badge, RecordForm } from './ui.jsx';
import { DEPARTMENTS, EVENT_STATUSES, EVENT_TYPES, PRIORITIES, ROLES, TASK_STATUSES, todayISO, shiftDate, formatDateTime, nameFor, performanceMetrics } from './lib.js';

const personOptions = (data, filter = () => true) => (data.team || []).filter(filter).map((person) => ({ value: person.id, label: person.name }));
const projectOptions = (data) => (data.projects || []).map((project) => ({ value: project.id, label: project.projectName }));
const eventOptions = (data) => (data.events || []).map((event) => ({ value: event.id, label: event.eventName }));
const stringFields = (data) => [
  { name: 'name', label: 'Name', required: true, section: 'Basic information', placeholder: 'Full name' },
  { name: 'username', label: 'Username', placeholder: '@username' },
  { name: 'department', label: 'Department', type: 'select', required: true, options: DEPARTMENTS, placeholder: 'Select department' },
  { name: 'role', label: 'Role', type: 'select', required: true, options: (form) => form.department === 'Other' ? [] : (ROLES[form.department] || []), when: (form) => form.department !== 'Other', placeholder: 'Select role' },
  { name: 'role', label: 'Custom role', required: true, when: (form) => form.department === 'Other', placeholder: 'Add a role under Other' },
  { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Offline'], section: 'Working profile', required: true },
  { name: 'joined', label: 'Joining date', type: 'date' },
  { name: 'manager', label: 'Manager', placeholder: 'Manager or team lead' },
  { name: 'timezone', label: 'Timezone' },
  { name: 'workingHours', label: 'Working hours', placeholder: 'e.g. 09:00–17:00 UTC' },
  { name: 'currentWork', label: 'Current work', wide: true, placeholder: 'What this person is focused on now' },
  { name: 'currentScore', label: 'Current performance score', type: 'number', min: 0, max: 100, step: 1 },
  { name: 'managerRating', label: 'Manager rating (1–5)', type: 'number', min: 1, max: 5, step: 0.5 },
  { name: 'primaryResponsibility', label: 'Primary responsibility', section: 'Responsibilities', type: 'textarea', rows: 2, wide: true },
  { name: 'secondaryResponsibility', label: 'Secondary responsibility', type: 'textarea', rows: 2, wide: true },
  { name: 'projects', label: 'Assigned projects', type: 'multi', options: (form, data) => projectOptions(data), wide: true },
  { name: 'communities', label: 'Assigned communities', placeholder: 'Discord, X, Telegram' },
  { name: 'region', label: 'Region', when: (form) => form.department === 'Moderation' && ['Regional Mod', 'Mod Lead'].includes(form.role), section: 'Moderation details' },
  { name: 'language', label: 'Language', when: (form) => form.department === 'Moderation' && ['Regional Mod', 'Mod Lead'].includes(form.role) },
  { name: 'assignedCommunity', label: 'Assigned community', when: (form) => form.department === 'Moderation' && ['Regional Mod', 'Mod Lead'].includes(form.role) },
  { name: 'coverageHours', label: 'Coverage hours', when: (form) => form.department === 'Moderation' && ['Regional Mod', 'Mod Lead'].includes(form.role) },
  { name: 'assignedMods', label: 'Assigned moderators', type: 'multi', options: (form, data) => personOptions(data, (person) => person.id !== form.id && person.department === 'Moderation' && ['Moderator', 'Regional Mod'].includes(person.role)), wide: true, when: (form) => form.department === 'Moderation' && form.role === 'Mod Lead' },
  { name: 'teamNotes', label: 'Mod team notes', type: 'textarea', wide: true, when: (form) => form.department === 'Moderation' && form.role === 'Mod Lead' },
];

const taskFields = (data) => [
  { name: 'taskName', label: 'Task name', required: true, section: 'Task details', wide: true, placeholder: 'Name this task' },
  { name: 'description', label: 'Short description', type: 'textarea', rows: 2, wide: true },
  { name: 'assignedTo', label: 'Assigned to', type: 'select', options: personOptions(data), placeholder: 'Unassigned' },
  { name: 'department', label: 'Department', type: 'select', options: DEPARTMENTS, required: true, placeholder: 'Select department' },
  { name: 'role', label: 'Role', type: 'select', options: (form) => ROLES[form.department] || [], when: (form) => form.department !== 'Other', placeholder: 'Select role' },
  { name: 'role', label: 'Custom role', when: (form) => form.department === 'Other', placeholder: 'Enter custom role' },
  { name: 'priority', label: 'Priority', type: 'select', options: PRIORITIES, required: true, section: 'Schedule and ownership' },
  { name: 'startDate', label: 'Start date', type: 'date' },
  { name: 'dueDate', label: 'Due date', type: 'date' },
  { name: 'relatedProject', label: 'Related project', type: 'select', options: projectOptions(data), placeholder: 'No project' },
  { name: 'relatedEvent', label: 'Related event', type: 'select', options: eventOptions(data), placeholder: 'No event' },
  { name: 'status', label: 'Status', type: 'select', options: TASK_STATUSES, required: true, section: 'Progress and history' },
  { name: 'progress', label: 'Progress', type: 'progress', wide: true },
  { name: 'checklist', label: 'Checklist', type: 'checklist', wide: true, section: 'Checklist and notes' },
  { name: 'notes', label: 'Notes', type: 'textarea', wide: true, rows: 3 },
  { name: 'attachments', label: 'Attachments', type: 'files', wide: true },
];

const eventFields = (data) => [
  { name: 'eventName', label: 'Event name', required: true, section: 'Event details', wide: true },
  { name: 'eventType', label: 'Event type', type: 'select', options: EVENT_TYPES, required: true },
  { name: 'status', label: 'Status', type: 'select', options: EVENT_STATUSES, required: true },
  { name: 'date', label: 'Date', type: 'date', required: true, section: 'Time and ownership' },
  { name: 'startTime', label: 'Start time', type: 'time' },
  { name: 'endTime', label: 'End time', type: 'time' },
  { name: 'timezone', label: 'Timezone', placeholder: 'UTC' },
  { name: 'organizer', label: 'Organizer', placeholder: 'Manager or organizer name' },
  { name: 'assignedTeamMembers', label: 'Assigned team members', type: 'multi', options: personOptions(data), wide: true },
  { name: 'department', label: 'Department', type: 'select', options: ['Cross-team', ...DEPARTMENTS] },
  { name: 'platform', label: 'Platform', placeholder: 'Discord, X, Google Meet…' },
  { name: 'location', label: 'Location / link', placeholder: 'Room or meeting link', wide: true },
  { name: 'description', label: 'Description', type: 'textarea', wide: true, section: 'Purpose and preparation' },
  { name: 'objective', label: 'Objective', type: 'textarea', wide: true },
  { name: 'preparationTasks', label: 'Preparation checklist', type: 'checklist', wide: true },
  { name: 'notes', label: 'Notes', type: 'textarea', wide: true },
  { name: 'actualParticipants', label: 'Actual participants', type: 'number', min: 0, section: 'Post-event report', when: (form) => form.status === 'Completed' },
  { name: 'engagement', label: 'Engagement', placeholder: 'Manager-entered summary', when: (form) => form.status === 'Completed' },
  { name: 'whatWentWell', label: 'What went well', type: 'textarea', wide: true, when: (form) => form.status === 'Completed' },
  { name: 'problems', label: 'Problems', type: 'textarea', wide: true, when: (form) => form.status === 'Completed' },
  { name: 'majorOutcome', label: 'Major outcome', type: 'textarea', wide: true, when: (form) => form.status === 'Completed' },
  { name: 'eventManagerNotes', label: 'Manager notes', type: 'textarea', wide: true, when: (form) => form.status === 'Completed' },
  { name: 'followUpTasks', label: 'Follow-up tasks', type: 'textarea', wide: true, when: (form) => form.status === 'Completed' },
  { name: 'overallRating', label: 'Overall rating (1–5)', type: 'number', min: 1, max: 5, step: 0.5, when: (form) => form.status === 'Completed' },
];

const projectFields = (data) => [
  { name: 'projectName', label: 'Project name', required: true, section: 'Project details', wide: true },
  { name: 'description', label: 'Description', type: 'textarea', wide: true, rows: 3 },
  { name: 'startDate', label: 'Start date', type: 'date', section: 'Ownership and timeline' },
  { name: 'deadline', label: 'Deadline', type: 'date' },
  { name: 'manager', label: 'Manager', placeholder: 'Manager' },
  { name: 'department', label: 'Department', type: 'select', options: ['Cross-team', ...DEPARTMENTS] },
  { name: 'teamMembers', label: 'Team members', type: 'multi', options: personOptions(data), wide: true },
  { name: 'status', label: 'Status', type: 'select', options: ['Planned', 'In Progress', 'On Hold', 'Completed'], section: 'Notes' },
  { name: 'notes', label: 'Notes', type: 'textarea', wide: true },
];

const workLogFields = (data) => [
  { name: 'date', label: 'Date', type: 'date', required: true, section: 'Daily work', max: todayISO() },
  { name: 'personId', label: 'Team member', type: 'select', options: personOptions(data), required: true },
  { name: 'department', label: 'Department', type: 'select', options: DEPARTMENTS },
  { name: 'role', label: 'Role', type: 'select', options: (form) => ROLES[form.department] || [] },
  { name: 'workCompleted', label: 'Work completed', type: 'textarea', rows: 3, wide: true, required: true, section: 'Work notes' },
  { name: 'tasksCompleted', label: 'Tasks completed', type: 'multi', options: (form, data) => (data.tasks || []).filter((task) => !form.personId || task.assignedTo === form.personId).map((task) => ({ value: task.id, label: task.taskName })), wide: true },
  { name: 'contributions', label: 'Important contributions', type: 'textarea', wide: true },
  { name: 'problems', label: 'Problems', type: 'textarea', wide: true },
  { name: 'pendingWork', label: 'Pending work', type: 'textarea', wide: true },
  { name: 'managerNotes', label: 'Manager notes', type: 'textarea', wide: true },
];

const reviewFields = (data) => [
  { name: 'personId', label: 'Team member', type: 'select', options: personOptions(data), required: true, section: 'Review period' },
  { name: 'reviewType', label: 'Review type', type: 'select', options: ['Weekly', 'Monthly', 'Quarterly'], required: true },
  { name: 'periodLabel', label: 'Review period label', placeholder: 'October 2026', required: true },
  { name: 'periodStart', label: 'Period start', type: 'date' },
  { name: 'periodEnd', label: 'Period end', type: 'date' },
  { name: 'overallScore', label: 'Overall score (0–100)', type: 'number', min: 0, max: 100, required: true, section: 'Manager assessment' },
  { name: 'managerRating', label: 'Manager rating (1–5)', type: 'number', min: 1, max: 5, step: 0.5, required: true },
  { name: 'strengths', label: 'Strengths', type: 'textarea', wide: true },
  { name: 'weaknesses', label: 'Weaknesses', type: 'textarea', wide: true },
  { name: 'areasForImprovement', label: 'Areas for improvement', type: 'textarea', wide: true },
  { name: 'managerFeedback', label: 'Manager feedback', type: 'textarea', wide: true },
  { name: 'achievements', label: 'Achievements', type: 'textarea', wide: true },
  { name: 'nextGoals', label: 'Next goals', type: 'textarea', wide: true },
  { name: 'additionalResponsibilities', label: 'Additional responsibilities', type: 'textarea', wide: true },
];

const leaveFields = (data) => [
  { name: 'personId', label: 'Person', type: 'select', options: personOptions(data), required: true, section: 'Leave record' },
  { name: 'leaveStart', label: 'Leave start', type: 'date', required: true },
  { name: 'expectedReturn', label: 'Expected return', type: 'date' },
  { name: 'actualReturn', label: 'Actual return', type: 'date' },
  { name: 'reason', label: 'Reason', type: 'textarea', wide: true },
  { name: 'managerNote', label: 'Manager note', type: 'textarea', wide: true },
];

const issueFields = (data) => [
  { name: 'issue', label: 'Issue', required: true, section: 'Issue details', wide: true },
  { name: 'personId', label: 'Person', type: 'select', options: personOptions(data), placeholder: 'No person' },
  { name: 'department', label: 'Department', type: 'select', options: DEPARTMENTS },
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'priority', label: 'Priority', type: 'select', options: PRIORITIES },
  { name: 'status', label: 'Status', type: 'select', options: ['Open', 'Resolved'] },
  { name: 'description', label: 'Description', type: 'textarea', wide: true, section: 'Resolution' },
  { name: 'actionTaken', label: 'Action taken', type: 'textarea', wide: true },
  { name: 'resolution', label: 'Resolution', type: 'textarea', wide: true },
  { name: 'followUp', label: 'Follow-up', type: 'textarea', wide: true },
  { name: 'managerNotes', label: 'Manager notes', type: 'textarea', wide: true },
];

const followUpFields = (data) => [
  { name: 'followUp', label: 'Follow-up', required: true, section: 'Follow-up details', wide: true },
  { name: 'personId', label: 'Person', type: 'select', options: personOptions(data), placeholder: 'No person' },
  { name: 'department', label: 'Department', type: 'select', options: ['All', ...DEPARTMENTS] },
  { name: 'relatedTask', label: 'Related task', type: 'select', options: (data.tasks || []).map((task) => ({ value: task.id, label: task.taskName })), placeholder: 'No task' },
  { name: 'relatedEvent', label: 'Related event', type: 'select', options: eventOptions(data), placeholder: 'No event' },
  { name: 'dueDate', label: 'Due date', type: 'date' },
  { name: 'priority', label: 'Priority', type: 'select', options: PRIORITIES },
  { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Completed'] },
  { name: 'notes', label: 'Notes', type: 'textarea', wide: true },
];

const noteFields = (data) => [
  { name: 'title', label: 'Note title', required: true, section: 'Private manager note', wide: true },
  { name: 'targetType', label: 'Attach to', type: 'select', options: ['Person', 'Task', 'Project', 'Event', 'Department', 'Performance Review'], required: true },
  { name: 'targetId', label: 'Related record', type: 'select', options: (form) => {
    if (form.targetType === 'Person') return personOptions(data);
    if (form.targetType === 'Task') return (data.tasks || []).map((entry) => ({ value: entry.id, label: entry.taskName }));
    if (form.targetType === 'Project') return projectOptions(data);
    if (form.targetType === 'Event') return eventOptions(data);
    if (form.targetType === 'Performance Review') return (data.reviews || []).map((entry) => ({ value: entry.id, label: `${nameFor(entry.personId, data.team)} · ${entry.periodLabel}` }));
    if (form.targetType === 'Department') return DEPARTMENTS.map((entry) => ({ value: entry, label: entry }));
    return [];
  }, placeholder: 'Select a record', required: true },
  { name: 'department', label: 'Department', type: 'select', options: DEPARTMENTS },
  { name: 'pinned', label: 'Pin this note', type: 'select', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
  { name: 'body', label: 'Note', type: 'textarea', rows: 5, wide: true, required: true },
];

const meetingFields = (data) => [
  { name: 'meetingName', label: 'Meeting name', required: true, section: 'Meeting details', wide: true },
  { name: 'meetingType', label: 'Meeting type', type: 'select', options: ['Team Meeting', 'Mod Meeting', 'Department Meeting', '1-on-1', 'Performance Review', 'Partner Meeting'] },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'time', label: 'Time', type: 'time' },
  { name: 'participants', label: 'Participants', type: 'multi', options: personOptions(data), wide: true },
  { name: 'agenda', label: 'Agenda', type: 'textarea', wide: true, section: 'Notes and actions' },
  { name: 'notes', label: 'Notes', type: 'textarea', wide: true },
  { name: 'actionItems', label: 'Action items', type: 'checklist', wide: true },
  { name: 'followUpDate', label: 'Follow-up date', type: 'date' },
];

const schemaByKind = {
  team: { title: 'Team member', makeFields: stringFields },
  tasks: { title: 'Task', makeFields: taskFields },
  events: { title: 'Event', makeFields: eventFields },
  projects: { title: 'Project', makeFields: projectFields },
  workLogs: { title: 'Daily work log', makeFields: workLogFields },
  reviews: { title: 'Performance review', makeFields: reviewFields },
  leaves: { title: 'Leave record', makeFields: leaveFields },
  issues: { title: 'Issue', makeFields: issueFields },
  followUps: { title: 'Follow-up', makeFields: followUpFields },
  notes: { title: 'Manager note', makeFields: noteFields },
  meetings: { title: 'Meeting', makeFields: meetingFields },
};

const defaultsFor = (kind, record, data) => {
  const defaults = {
    team: { status: 'Active', department: 'Moderation', role: 'Moderator', joined: todayISO(), manager: 'Manager', currentScore: 0, managerRating: 3, projects: [], assignedMods: [], responsibilitiesHistory: [] },
    tasks: { status: 'To Do', priority: 'Medium', department: 'Moderation', role: 'Moderator', startDate: todayISO(), dueDate: shiftDate(todayISO(), 1), progress: 0, checklist: [], attachments: [], relatedProject: '', relatedEvent: '' },
    events: { eventType: 'Team Meeting', status: 'Scheduled', date: shiftDate(todayISO(), 1), startTime: '10:00', endTime: '10:30', timezone: 'UTC', organizer: 'Manager', assignedTeamMembers: [], department: 'Cross-team', preparationTasks: [], report: null, actualParticipants: '', overallRating: '' },
    projects: { status: 'Planned', manager: 'Manager', department: 'Cross-team', startDate: todayISO(), deadline: shiftDate(todayISO(), 7), teamMembers: [] },
    workLogs: { date: todayISO(), personId: '', department: '', role: '', tasksCompleted: [] },
    reviews: { reviewType: 'Monthly', periodLabel: new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date()), periodStart: `${todayISO().slice(0, 7)}-01`, periodEnd: todayISO(), managerRating: 4, overallScore: 0 },
    leaves: { leaveStart: todayISO(), expectedReturn: shiftDate(todayISO(), 2), actualReturn: '', reason: '', managerNote: '' },
    issues: { date: todayISO(), priority: 'Medium', status: 'Open', department: '', personId: '' },
    followUps: { dueDate: shiftDate(todayISO(), 1), priority: 'Medium', status: 'Pending', department: 'All', personId: '' },
    notes: { targetType: 'Person', targetId: '', department: '', pinned: false },
    meetings: { meetingType: 'Team Meeting', date: shiftDate(todayISO(), 1), time: '10:00', participants: [], actionItems: [] },
  }[kind] || {};
  const merged = { ...defaults, ...(record || {}) };
  if (kind === 'workLogs' && record?.personId) {
    const person = data.team.find((entry) => entry.id === record.personId);
    merged.department = person?.department || merged.department;
    merged.role = person?.role || merged.role;
  }
  if (kind === 'events' && record?.report) Object.assign(merged, {
    actualParticipants: record.report.actualParticipants ?? '', engagement: record.report.engagement ?? '', whatWentWell: record.report.whatWentWell || '',
    problems: record.report.problems || '', majorOutcome: record.report.majorOutcome || '', eventManagerNotes: record.report.managerNotes || '', followUpTasks: record.report.followUpTasks || '', overallRating: record.report.overallRating ?? '',
  });
  if (kind === 'notes') merged.pinned = record?.pinned ? 'true' : 'false';
  return merged;
};

function HistoryExtra({ kind, record, data }) {
  if (!record) return null;
  if (kind === 'tasks' && record.history?.length) return <div className="history-extra"><div className="history-extra-title"><History size={15} /> Task history</div>{[...record.history].reverse().map((item) => <div className="mini-timeline-row" key={item.id}><i /><span>{item.message}</span><time>{formatDateTime(item.timestamp)}</time></div>)}</div>;
  if (kind === 'team' && record.responsibilitiesHistory?.length) return <div className="history-extra"><div className="history-extra-title"><History size={15} /> Previous responsibilities</div>{[...record.responsibilitiesHistory].reverse().map((item, index) => <div className="mini-timeline-row" key={`${item.changedAt}-${index}`}><i /><span>{item.responsibilities}</span><time>{formatDateTime(item.changedAt)}</time></div>)}</div>;
  if (kind === 'reviews' && record.revisions?.length) return <div className="history-extra"><div className="history-extra-title"><History size={15} /> Previous review versions retained</div><p>{record.revisions.length} earlier version{record.revisions.length === 1 ? '' : 's'} saved.</p></div>;
  return null;
}

export function EditorModal({ kind, record = null, data, onSave, onUpload, onClose }) {
  const schema = schemaByKind[kind];
  if (!schema) return null;
  const isEditing = Boolean(record?.id);
  const initial = defaultsFor(kind, record, data);
  const fields = schema.makeFields(data);
  let subtitle = isEditing ? 'Update details. A history entry is kept for important changes.' : 'Add a private record to the manager workspace.';
  if (kind === 'notes') subtitle = 'Private to Manager accounts. Notes are not shared with team members.';
  if (kind === 'team') subtitle = 'One centrally managed record. Team members do not receive separate logins.';
  if (kind === 'leaves') subtitle = 'Leave records stay in history. The member’s availability is tracked separately.';
  let extra = <HistoryExtra kind={kind} record={isEditing ? record : null} data={data} />;
  if (kind === 'reviews') {
    extra = (form) => {
      const metrics = performanceMetrics(data, form.personId || data.team[0]?.id);
      return <>
        <div className="metrics-snapshot"><div className="metrics-title"><Activity size={15} /> Recorded performance metrics</div><div className="metrics-mini-grid">{[
          ['Tasks assigned', metrics.tasksAssigned], ['Completed', metrics.tasksCompleted], ['Pending', metrics.tasksPending], ['Overdue', metrics.overdueTasks], ['Completion rate', `${metrics.completionRate}%`], ['Projects completed', metrics.projectsCompleted], ['Events supported', metrics.eventsSupported], ['Issues handled', metrics.issuesHandled], ['Reports submitted', metrics.reportsSubmitted],
        ].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></div>
        <HistoryExtra kind={kind} record={isEditing ? record : null} data={data} />
      </>;
    };
  }
  const transform = (form) => {
    if (kind === 'events') {
      const { actualParticipants, engagement, whatWentWell, problems, majorOutcome, eventManagerNotes, followUpTasks, overallRating, ...event } = form;
      event.report = form.status === 'Completed' ? { actualParticipants: actualParticipants === '' ? null : Number(actualParticipants), engagement, whatWentWell, problems, teamMembersInvolved: form.assignedTeamMembers || [], majorOutcome, managerNotes: eventManagerNotes, followUpTasks, overallRating: overallRating === '' ? null : Number(overallRating), recordedAt: new Date().toISOString() } : (record?.report || null);
      return event;
    }
    if (kind === 'workLogs') {
      const person = data.team.find((entry) => entry.id === form.personId);
      return { ...form, department: person?.department || form.department, role: person?.role || form.role };
    }
    if (kind === 'notes') return { ...form, pinned: form.pinned === true || form.pinned === 'true' };
    if (kind === 'reviews' && !form.metrics) return { ...form, metrics: performanceMetrics(data, form.personId) };
    return form;
  };
  return <RecordForm key={`${kind}-${record?.id || 'new'}`} title={`${isEditing ? 'Edit' : 'Add'} ${schema.title}`} subtitle={subtitle} initial={initial} fields={fields} data={data} onSave={(value) => onSave(kind, value)} onUpload={onUpload} onClose={onClose} saveLabel={isEditing ? 'Save changes' : `Create ${schema.title.toLowerCase()}`} extra={extra} transform={transform} />;
}
