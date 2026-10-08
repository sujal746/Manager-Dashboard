export const DEPARTMENTS = ['Moderation', 'Content', 'BD', 'Shiller', 'Creative', 'Research / Analyst', 'Other'];
export const WORK_DEPARTMENTS = ['All', 'Moderation', 'Content', 'BD', 'Shiller', 'Creative', 'Research / Analyst'];
export const ROLES = {
  Moderation: ['Moderator', 'Regional Mod', 'Mod Lead'],
  Content: ['Content'],
  BD: ['BD'],
  Shiller: ['Shiller'],
  Creative: ['Creative'],
  'Research / Analyst': ['Research / Analyst'],
  Other: [],
};
export const TASK_STATUSES = ['To Do', 'In Progress', 'In Review', 'Done'];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
export const EVENT_STATUSES = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
export const EVENT_TYPES = ['AMA', 'Community Event', 'Giveaway', 'Campaign', 'Team Meeting', 'Mod Meeting', 'Partnership Call', 'Content Shoot', 'Tournament', 'Internal Training', 'Other'];
export const todayISO = () => new Date().toISOString().slice(0, 10);
export const shiftDate = (date, offset) => {
  const value = new Date(`${date || todayISO()}T12:00:00`);
  value.setDate(value.getDate() + offset);
  return value.toISOString().slice(0, 10);
};
export const formatDate = (value, options = {}) => {
  if (!value) return '—';
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return String(value);
  const { year, ...rest } = options;
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', ...(year ? { year: 'numeric' } : {}), ...rest }).format(date);
};
export const formatDateTime = (value) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
};
export const nameFor = (id, team = []) => team.find((person) => person.id === id)?.name || (id === 'Manager' ? 'Manager' : 'Unassigned');
export const labelForRole = (department) => ROLES[department] || [];
export const compareDate = (a, b) => String(a || '').localeCompare(String(b || ''));
export const initials = (value = '') => String(value).trim().split(/\s+/).slice(0, 2).map((word) => word[0] || '').join('').toUpperCase() || 'M';
export const isToday = (date) => date === todayISO();
export const isOverdue = (date) => Boolean(date && date < todayISO());
export const isSoon = (date, days = 2) => Boolean(date && date >= todayISO() && date <= shiftDate(todayISO(), days));
export const prettyLabel = (value = '') => String(value).replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
export const visible = (items = []) => items.filter((item) => !item.archivedAt);

export function taskMetrics(data, personId = '', department = '') {
  const tasks = visible(data.tasks || []).filter((task) => (!personId || task.assignedTo === personId) && (!department || task.department === department));
  const completed = tasks.filter((task) => task.status === 'Done').length;
  const overdue = tasks.filter((task) => task.status !== 'Done' && task.status !== 'Cancelled' && isOverdue(task.dueDate)).length;
  const pending = tasks.length - completed;
  return { tasksAssigned: tasks.length, tasksCompleted: completed, tasksPending: pending, overdueTasks: overdue, completionRate: tasks.length ? Math.round((completed / tasks.length) * 100) : 0 };
}

export function performanceMetrics(data, personId) {
  const metrics = taskMetrics(data, personId);
  const person = (data.team || []).find((entry) => entry.id === personId);
  const assignedProjects = visible(data.projects || []).filter((project) => (project.teamMembers || []).includes(personId));
  const completedProjects = assignedProjects.filter((project) => project.status === 'Completed').length;
  const eventsSupported = visible(data.events || []).filter((event) => (event.assignedTeamMembers || []).includes(personId) && event.status === 'Completed').length;
  const issuesHandled = visible(data.issues || []).filter((issue) => issue.personId === personId && issue.status === 'Resolved').length;
  const reportsSubmitted = visible(data.workLogs || []).filter((log) => log.personId === personId && /report|summary/i.test(`${log.workCompleted} ${log.tasksCompleted?.join(' ')}`)).length;
  return { ...metrics, projectsCompleted: completedProjects, eventsSupported, issuesHandled, reportsSubmitted, department: person?.department || '' };
}

export function departmentMetrics(data, department) {
  const team = visible(data.team || []).filter((person) => person.department === department);
  const taskCounts = taskMetrics(data, '', department);
  const scores = team.map((person) => Number(person.currentScore || 0)).filter(Number.isFinite);
  return {
    teamSize: team.length,
    averagePerformance: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0,
    tasksCompleted: taskCounts.tasksCompleted,
    pendingTasks: taskCounts.tasksPending,
    overdueTasks: taskCounts.overdueTasks,
  };
}

export function initialsColor(seed = '') {
  const colors = ['lavender', 'mint', 'peach', 'sky', 'rose', 'gold'];
  const index = String(seed).split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
}

export function csvEscape(value) {
  const text = Array.isArray(value) ? value.map((item) => typeof item === 'object' ? item.text || '' : item).join('; ') : value == null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function buildReportRows(type, data, filters = {}) {
  const department = filters.department && filters.department !== 'All' ? filters.department : '';
  const from = filters.from || '';
  const to = filters.to || '';
  const personId = filters.personId || '';
  const inRange = (date) => (!from || String(date || '') >= from) && (!to || String(date || '') <= to);
  const people = visible(data.team || []).filter((person) => (!department || person.department === department) && (!personId || person.id === personId));
  const personIds = new Set(people.map((person) => person.id));
  const make = (source, dateKey, fields, filterer = () => true) => visible(source || []).filter((item) => inRange(item[dateKey]) && filterer(item)).map((item) => Object.fromEntries(fields.map(([label, key, transform]) => [label, transform ? transform(item[key], item) : item[key] ?? ''])));
  if (type === 'Daily Team Report' || type === 'Weekly Team Report' || type === 'Monthly Team Report' || type === 'Individual Performance Report' || type === 'Department Report') {
    return people.map((person) => {
      const tasks = visible(data.tasks || []).filter((task) => task.assignedTo === person.id && inRange(task.dueDate || task.createdAt?.slice(0, 10)));
      const tasksCompleted = tasks.filter((task) => task.status === 'Done').length;
      const overdueTasks = tasks.filter((task) => task.status !== 'Done' && isOverdue(task.dueDate)).length;
      const projectsCompleted = visible(data.projects || []).filter((project) => (project.teamMembers || []).includes(person.id) && project.status === 'Completed' && inRange(project.deadline || project.startDate)).length;
      const eventsSupported = visible(data.events || []).filter((event) => (event.assignedTeamMembers || []).includes(person.id) && event.status === 'Completed' && inRange(event.date)).length;
      const issuesHandled = visible(data.issues || []).filter((issue) => issue.personId === person.id && issue.status === 'Resolved' && inRange(issue.date)).length;
      const reportsSubmitted = visible(data.workLogs || []).filter((log) => log.personId === person.id && inRange(log.date) && /report|summary/i.test(`${log.workCompleted} ${log.tasksCompleted?.join(' ')}`)).length;
      const reviews = visible(data.reviews || []).filter((review) => review.personId === person.id && inRange(review.periodEnd || review.createdAt?.slice(0, 10))).sort((a, b) => compareDate(b.periodEnd, a.periodEnd));
      return { Name: person.name, Department: person.department, Role: person.role, Status: person.status, 'Current Work': person.currentWork || '', 'Performance Score': person.currentScore || '', 'Tasks Assigned': tasks.length, 'Tasks Completed': tasksCompleted, 'Tasks Pending': tasks.length - tasksCompleted, 'Overdue Tasks': overdueTasks, 'Projects Completed': projectsCompleted, 'Events Supported': eventsSupported, 'Issues Handled': issuesHandled, 'Reports Submitted': reportsSubmitted, 'Latest Review': reviews[0]?.periodLabel || '', 'Latest Review Score': reviews[0]?.overallScore ?? '' };
    });
  }
  if (type === 'Task Report') return make(data.tasks, 'dueDate', [['Task', 'taskName'], ['Description', 'description'], ['Department', 'department'], ['Role', 'role'], ['Assigned To', 'assignedTo', (id) => nameFor(id, data.team)], ['Status', 'status'], ['Priority', 'priority'], ['Start Date', 'startDate'], ['Due Date', 'dueDate'], ['Progress %', 'progress'], ['Project', 'relatedProject', (id) => data.projects?.find((project) => project.id === id)?.projectName || ''], ['Event', 'relatedEvent', (id) => data.events?.find((event) => event.id === id)?.eventName || '']], (task) => (!department || task.department === department) && (!personId || task.assignedTo === personId));
  if (type === 'Event Report') return make(data.events, 'date', [['Event', 'eventName'], ['Type', 'eventType'], ['Date', 'date'], ['Time', 'startTime'], ['Department', 'department'], ['Status', 'status'], ['Organizer', 'organizer'], ['Team', 'assignedTeamMembers', (ids) => (ids || []).map((id) => nameFor(id, data.team)).join(', ')], ['Outcome', 'report', (report) => report?.majorOutcome || '']], (event) => (!department || event.department === department) && (!personId || (event.assignedTeamMembers || []).includes(personId)));
  if (type === 'Leave Report') return make(data.leaves, 'leaveStart', [['Person', 'personId', (id) => nameFor(id, data.team)], ['Department', 'personId', (id) => data.team?.find((person) => person.id === id)?.department || ''], ['Leave Start', 'leaveStart'], ['Expected Return', 'expectedReturn'], ['Actual Return', 'actualReturn'], ['Reason', 'reason'], ['Manager Note', 'managerNote']], (leave) => (!department || data.team?.find((person) => person.id === leave.personId)?.department === department) && (!personId || leave.personId === personId));
  if (type === 'Project Report') return make(data.projects, 'startDate', [['Project', 'projectName'], ['Department', 'department'], ['Start Date', 'startDate'], ['Deadline', 'deadline'], ['Status', 'status'], ['Team Members', 'teamMembers', (ids) => (ids || []).map((id) => nameFor(id, data.team)).join(', ')], ['Description', 'description']], (project) => (!department || project.department === department) && (!personId || (project.teamMembers || []).includes(personId)));
  if (type === 'Issue Report') return make(data.issues, 'date', [['Issue', 'issue'], ['Department', 'department'], ['Person', 'personId', (id) => nameFor(id, data.team)], ['Date', 'date'], ['Priority', 'priority'], ['Status', 'status'], ['Resolution', 'resolution']], (issue) => (!department || issue.department === department) && (!personId || issue.personId === personId));
  if (type === 'Event Schedule') return make(data.events, 'date', [['Event', 'eventName'], ['Type', 'eventType'], ['Date', 'date'], ['Start', 'startTime'], ['End', 'endTime'], ['Status', 'status'], ['Department', 'department']], (event) => (!department || event.department === department) && (!personId || (event.assignedTeamMembers || []).includes(personId)));
  if (type === 'Daily Work Log') return make(data.workLogs, 'date', [['Date', 'date'], ['Person', 'personId', (id) => nameFor(id, data.team)], ['Department', 'department'], ['Role', 'role'], ['Work Completed', 'workCompleted'], ['Contributions', 'contributions'], ['Problems', 'problems'], ['Pending Work', 'pendingWork'], ['Manager Notes', 'managerNotes']], (log) => (!department || log.department === department) && (!personId || log.personId === personId));
  const all = visible(data.team || []).filter((person) => (!department || person.department === department) && (!personId || person.id === personId));
  return all.map((person) => ({ Name: person.name, Department: person.department, Role: person.role, Status: person.status, Joined: person.joined, 'Current Work': person.currentWork || '', Performance: person.currentScore || '' }));
}

export const REPORT_TYPES = ['Daily Team Report', 'Weekly Team Report', 'Monthly Team Report', 'Department Report', 'Individual Performance Report', 'Task Report', 'Event Report', 'Leave Report', 'Project Report', 'Issue Report', 'Daily Work Log', 'Event Schedule'];
