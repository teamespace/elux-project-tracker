import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

// Run with: npx wrangler d1 execute elux-tracker --local --file=./server/database/seed.sql
// Or use this script via: npx tsx server/database/seed.ts (local D1 via wrangler binding)

export async function seed(db: ReturnType<typeof drizzle>) {
  // Delete in reverse dependency order to avoid FK constraint errors
  await db.delete(schema.timeEntries)
  await db.delete(schema.taskDependencies)
  await db.delete(schema.myDay)
  await db.delete(schema.notifications)
  await db.delete(schema.taskLabels)
  await db.delete(schema.subtasks)
  await db.delete(schema.comments)
  await db.delete(schema.activity)
  await db.delete(schema.tasks)
  await db.delete(schema.criticalIssues)
  await db.delete(schema.docs)
  await db.delete(schema.templates)
  await db.delete(schema.goalProjects)
  await db.delete(schema.projectMembers)
  await db.delete(schema.kpis)
  await db.delete(schema.goalLabels)
  await db.delete(schema.projects)
  await db.delete(schema.goals)
  await db.delete(schema.users)

  // ── Users ──────────────────────────────────────────────────────────────────
  await db.insert(schema.users).values([
    {
      id: 'user-rasya',
      email: 'rasya@queebo.chat',
      passwordHash: 'plain:rasya123',
      name: 'Rasya',
      initials: 'R',
      avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rasya',
      role: 'admin',
    },
    {
      id: 'user-dito',
      email: 'dito@elux.id',
      passwordHash: 'plain:dito123',
      name: 'Dito',
      initials: 'D',
      avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Dito',
      role: 'member',
    },
    {
      id: 'user-maya',
      email: 'maya@elux.id',
      passwordHash: 'plain:maya123',
      name: 'Maya',
      initials: 'M',
      avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Maya',
      role: 'member',
    },
    {
      id: 'user-rara',
      email: 'rara@elux.id',
      passwordHash: 'plain:rara123',
      name: 'Rara',
      initials: 'Ra',
      avatar: 'https://api.dicebear.com/9.x/micah/svg?seed=Rara',
      role: 'member',
    },
  ])

  // ── Goals ──────────────────────────────────────────────────────────────────
  await db.delete(schema.goals)
  await db.insert(schema.goals).values([
    { id: 'goal-1', title: 'Q3 Ship Product Redesign', description: 'Deliver a complete redesign of the core product experience to improve user engagement, reduce churn, and modernize the visual language across all key user journeys.', status: 'on-track', statusLabel: 'ON TRACK', progress: 58, ownerId: 'user-rasya', quarter: 'Q3 2026', dueDate: 'Sep 30, 2026' },
    { id: 'goal-2', title: 'Q3 Improve Dev Velocity', description: 'Increase the speed and quality of software delivery by improving CI/CD pipelines, reducing review times, and raising test coverage across all teams.', status: 'at-risk', statusLabel: 'AT RISK', progress: 28, ownerId: 'user-maya', quarter: 'Q3 2026', dueDate: 'Sep 30, 2026' },
    { id: 'goal-3', title: 'Q4 Launch Beta to 100 Users', description: 'Acquire and onboard the first 100 beta users, gather qualitative feedback, and achieve a healthy early retention rate before the public launch.', status: 'not-started', statusLabel: 'NOT STARTED', progress: 0, ownerId: 'user-dito', quarter: 'Q4 2026', dueDate: 'Dec 31, 2026' },
    { id: 'goal-4', title: 'Q2 Design System Foundation', description: 'Establish a shared design system with components, tokens, and documentation that all product teams can use consistently.', status: 'delayed', statusLabel: 'DELAYED', progress: 40, ownerId: 'user-rasya', quarter: 'Q2 2026', dueDate: 'Jun 30, 2026' },
  ])

  await db.insert(schema.goalLabels).values([
    { id: 'gl-1', goalId: 'goal-1', name: 'Product', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { id: 'gl-2', goalId: 'goal-1', name: 'Q3', color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { id: 'gl-3', goalId: 'goal-2', name: 'Engineering', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { id: 'gl-4', goalId: 'goal-3', name: 'Beta', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { id: 'gl-5', goalId: 'goal-3', name: 'Growth', color: 'bg-rose-50 text-rose-600 border-rose-200' },
  ])

  await db.insert(schema.kpis).values([
    { id: 'kpi-1', goalId: 'goal-1', name: 'NPS Score ≥ 45', currentValue: '38', targetValue: '45', progress: 84, status: 'at-risk', statusLabel: 'AT RISK', ownerId: 'user-rasya', dueDate: 'Sep 30' },
    { id: 'kpi-2', goalId: 'goal-1', name: 'Reduce page load < 2s', currentValue: '2.1s', targetValue: '2.0s', progress: 95, status: 'on-track', statusLabel: 'ON TRACK', ownerId: 'user-dito', dueDate: 'Aug 15' },
    { id: 'kpi-3', goalId: 'goal-1', name: 'Launch 3 core features', currentValue: '1', targetValue: '3', progress: 33, status: 'delayed', statusLabel: 'DELAYED', ownerId: 'user-maya', dueDate: 'Sep 30' },
    { id: 'kpi-4', goalId: 'goal-2', name: 'Deploy frequency ≥ 3x/week', currentValue: '1.5', targetValue: '3', progress: 50, status: 'at-risk', statusLabel: 'AT RISK', ownerId: 'user-maya', dueDate: 'Sep 30' },
    { id: 'kpi-5', goalId: 'goal-2', name: 'PR review time < 4h', currentValue: '6h', targetValue: '4h', progress: 67, status: 'at-risk', statusLabel: 'AT RISK', ownerId: 'user-dito', dueDate: 'Aug 30' },
    { id: 'kpi-6', goalId: 'goal-2', name: 'Test coverage ≥ 80%', currentValue: '72%', targetValue: '80%', progress: 90, status: 'on-track', statusLabel: 'ON TRACK', ownerId: 'user-rara', dueDate: 'Sep 15' },
    { id: 'kpi-7', goalId: 'goal-3', name: 'Beta user signups ≥ 100', currentValue: '0', targetValue: '100', progress: 0, status: 'not-started', statusLabel: 'NOT STARTED', ownerId: 'user-dito', dueDate: 'Dec 31' },
    { id: 'kpi-8', goalId: 'goal-3', name: 'User retention ≥ 60%', currentValue: '0%', targetValue: '60%', progress: 0, status: 'not-started', statusLabel: 'NOT STARTED', ownerId: 'user-maya', dueDate: 'Dec 31' },
  ])

  // ── Projects ───────────────────────────────────────────────────────────────
  await db.delete(schema.projects)
  await db.insert(schema.projects).values([
    { id: 'p1', key: 'ALPHA', name: 'Alpha Project', category: 'UX Redesign', description: 'Redesigning core product UX to improve activation, retention, and time-to-value across the entire product surface.', status: 'at-risk', statusLabel: 'At Risk', priority: 'high', priorityLabel: 'High', progress: 62, doneT: 9, totalT: 14, openTasks: 14, atRiskTasks: 2, dueDate: 'Aug 30, 2025', ownerId: 'user-rasya', riskLevel: 'high', riskReason: '3 tasks overdue', color: 'bg-blue-500', labels: 'UX, Q3', attachCount: 3, commentCount: 7 },
    { id: 'p2', key: 'BETA', name: 'Beta Launch', category: 'Q3 Milestone', description: 'Public launch milestone for Q3, marketing site, landing page, and announcement prep.', status: 'on-track', statusLabel: 'On Track', priority: 'medium', priorityLabel: 'Medium', progress: 78, doneT: 7, totalT: 9, openTasks: 9, atRiskTasks: 0, dueDate: 'Jul 15, 2025', ownerId: 'user-maya', riskLevel: 'low', riskReason: '', color: 'bg-green-500', labels: 'Q3', attachCount: 5, commentCount: 12 },
    { id: 'p3', key: 'MOB', name: 'Mobile App MVP', category: 'Product', description: 'iOS + Android MVP, core flows and onboarding.', status: 'on-track', statusLabel: 'On Track', priority: 'high', priorityLabel: 'High', progress: 45, doneT: 9, totalT: 20, openTasks: 20, atRiskTasks: 1, dueDate: 'Oct 1, 2025', ownerId: 'user-rasya', riskLevel: 'medium', riskReason: 'Checkout flow overdue', color: 'bg-purple-500', labels: 'Mobile, Q4', attachCount: 8, commentCount: 4 },
    { id: 'p4', key: 'ANL', name: 'Analytics Dashboard', category: 'Data & Reporting', description: 'Data & reporting suite for internal and external use.', status: 'at-risk', statusLabel: 'At Risk', priority: 'high', priorityLabel: 'High', progress: 30, doneT: 4, totalT: 13, openTasks: 13, atRiskTasks: 3, dueDate: 'Jul 5, 2025', ownerId: 'user-maya', riskLevel: 'high', riskReason: '3 at-risk tasks, past deadline', color: 'bg-amber-500', labels: 'Data', attachCount: 2, commentCount: 9 },
    { id: 'p5', key: 'CUS', name: 'Customer Portal', category: 'Self-serve', description: 'Self-serve billing, profile, and account management.', status: 'on-track', statusLabel: 'On Track', priority: 'low', priorityLabel: 'Low', progress: 90, doneT: 18, totalT: 20, openTasks: 2, atRiskTasks: 0, dueDate: 'Aug 1, 2025', ownerId: 'user-rara', riskLevel: 'low', riskReason: '', color: 'bg-teal-500', labels: '', attachCount: 11, commentCount: 3 },
    { id: 'p6', key: 'API', name: 'API Gateway v2', category: 'Infrastructure', description: 'Rate limiting, auth middleware, and routing redesign.', status: 'delayed', statusLabel: 'Delayed', priority: 'high', priorityLabel: 'High', progress: 15, doneT: 2, totalT: 12, openTasks: 12, atRiskTasks: 4, dueDate: 'Jun 30, 2025', ownerId: 'user-dito', riskLevel: 'high', riskReason: '4 at-risk tasks, overdue', color: 'bg-red-500', labels: 'Infra, Backend', attachCount: 0, commentCount: 14 },
    { id: 'p7', key: 'DS2', name: 'Design System v2', category: 'Design', description: 'Component library, tokens, and documentation rollout.', status: 'on-track', statusLabel: 'On Track', priority: 'medium', priorityLabel: 'Medium', progress: 55, doneT: 6, totalT: 11, openTasks: 5, atRiskTasks: 0, dueDate: 'Sep 15, 2025', ownerId: 'user-rasya', riskLevel: 'low', riskReason: '', color: 'bg-pink-500', labels: 'Design, Q3', attachCount: 6, commentCount: 8 },
    { id: 'p8', key: 'INT', name: 'Internal Tools', category: 'Design System', description: 'Tracker revamp and design system rollout for internal team.', status: 'not-started', statusLabel: 'Not Started', priority: 'low', priorityLabel: 'Low', progress: 0, doneT: 0, totalT: 0, openTasks: 0, atRiskTasks: 0, dueDate: 'Sep 10, 2025', ownerId: 'user-rasya', riskLevel: 'low', riskReason: '', color: 'bg-gray-500', labels: '', attachCount: 0, commentCount: 0 },
  ])

  await db.insert(schema.projectMembers).values([
    { projectId: 'p1', userId: 'user-rasya', seed: 'Rasya', bg: 'b6e3f4' },
    { projectId: 'p1', userId: 'user-maya', seed: 'Maya', bg: 'ffd5dc' },
    { projectId: 'p1', userId: 'user-dito', seed: 'Dito', bg: 'c0aede' },
    { projectId: 'p2', userId: 'user-maya', seed: 'Maya', bg: 'ffd5dc' },
    { projectId: 'p3', userId: 'user-rasya', seed: 'Rasya', bg: 'b6e3f4' },
    { projectId: 'p3', userId: 'user-rara', seed: 'Rara', bg: 'f9a8d4' },
    { projectId: 'p4', userId: 'user-maya', seed: 'Maya', bg: 'ffd5dc' },
    { projectId: 'p5', userId: 'user-rara', seed: 'Rara', bg: 'f9a8d4' },
    { projectId: 'p6', userId: 'user-dito', seed: 'Dito', bg: 'c0aede' },
    { projectId: 'p6', userId: 'user-maya', seed: 'Maya', bg: 'ffd5dc' },
    { projectId: 'p7', userId: 'user-rasya', seed: 'Rasya', bg: 'b6e3f4' },
    { projectId: 'p7', userId: 'user-rara', seed: 'Rara', bg: 'f9a8d4' },
  ])

  await db.insert(schema.goalProjects).values([
    { goalId: 'goal-1', projectId: 'p1', titleOverride: 'Auth & Onboarding Redesign', taskCount: 8 },
    { goalId: 'goal-1', projectId: 'p7', titleOverride: 'Core Dashboard v2', taskCount: 5 },
    { goalId: 'goal-2', projectId: 'p2', titleOverride: 'API Documentation', taskCount: 3 },
  ])

  // ── Tasks ──────────────────────────────────────────────────────────────────
  await db.delete(schema.tasks)
  await db.insert(schema.tasks).values([
    // Overdue
    { id: 'task-t1', title: 'Auth redesign implementation', status: 'overdue', statusLabel: 'Overdue', priority: 'high', priorityLabel: 'HIGH', assigneeId: 'user-rasya', projectId: 'p1', projectName: 'Alpha Project', dueDate: 'Jun 10', dueType: 'overdue', done: false },
    { id: 'task-t2', title: 'Mobile checkout flow', status: 'overdue', statusLabel: 'Overdue', priority: 'high', priorityLabel: 'HIGH', assigneeId: 'user-rasya', projectId: 'p3', projectName: 'Mobile App MVP', dueDate: 'Jun 14', dueType: 'overdue', done: false },
    { id: 'task-t3', title: 'Token naming inconsistency fix', status: 'overdue', statusLabel: 'Overdue', priority: 'medium', priorityLabel: 'MED', assigneeId: 'user-rasya', projectId: 'p7', projectName: 'Design System v2', dueDate: 'Jun 18', dueType: 'overdue', done: false },
    // In Progress
    { id: 'task-t4', title: 'Produce high-fidelity mockups', status: 'in-progress', statusLabel: 'In Progress', priority: 'high', priorityLabel: 'HIGH', assigneeId: 'user-rasya', projectId: 'p1', projectName: 'Alpha Project', dueDate: 'Today', dueType: 'today', done: false },
    { id: 'task-t5', title: 'API rate limit specification', status: 'in-progress', statusLabel: 'In Progress', priority: 'high', priorityLabel: 'HIGH', assigneeId: 'user-rasya', projectId: 'p2', projectName: 'Beta Launch', dueDate: 'Today', dueType: 'today', done: false },
    { id: 'task-t6', title: 'Component library export', status: 'in-progress', statusLabel: 'In Progress', priority: 'medium', priorityLabel: 'MED', assigneeId: 'user-rasya', projectId: 'p7', projectName: 'Design System v2', dueDate: 'Jun 23', dueType: 'week', done: false },
    { id: 'task-t7', title: 'Implement payment gateway', status: 'in-progress', statusLabel: 'In Progress', priority: 'medium', priorityLabel: 'MED', assigneeId: 'user-rasya', projectId: 'p3', projectName: 'Mobile App MVP', dueDate: 'Jun 24', dueType: 'week', done: false },
    { id: 'task-t8', title: 'Write release notes draft', status: 'in-progress', statusLabel: 'In Progress', priority: 'low', priorityLabel: 'LOW', assigneeId: 'user-rasya', projectId: 'p2', projectName: 'Beta Launch', dueDate: '—', dueType: 'none', done: false },
    // To Do
    { id: 'task-t9', title: 'Handoff to engineering', status: 'todo', statusLabel: 'To Do', priority: 'medium', priorityLabel: 'MED', assigneeId: 'user-rasya', projectId: 'p1', projectName: 'Alpha Project', dueDate: 'Jul 15', dueType: 'none', done: false },
    { id: 'task-t10', title: 'Onboarding copy finalization', status: 'todo', statusLabel: 'To Do', priority: 'low', priorityLabel: 'LOW', assigneeId: 'user-rasya', projectId: 'p2', projectName: 'Beta Launch', dueDate: 'Jul 1', dueType: 'none', done: false },
    { id: 'task-t11', title: 'App store submission checklist', status: 'todo', statusLabel: 'To Do', priority: 'low', priorityLabel: 'LOW', assigneeId: 'user-rasya', projectId: 'p3', projectName: 'Mobile App MVP', dueDate: 'Jun 30', dueType: 'week', done: false },
    // In Review
    { id: 'task-t12', title: 'Draft information architecture', status: 'in-review', statusLabel: 'In Review', priority: 'high', priorityLabel: 'HIGH', assigneeId: 'user-rasya', projectId: 'p1', projectName: 'Alpha Project', dueDate: 'Jun 22', dueType: 'week', done: false },
    { id: 'task-t13', title: 'Design system documentation', status: 'in-review', statusLabel: 'In Review', priority: 'medium', priorityLabel: 'MED', assigneeId: 'user-rasya', projectId: 'p7', projectName: 'Design System v2', dueDate: 'Jun 25', dueType: 'none', done: false },
    // Completed
    { id: 'task-t14', title: 'Finalize user research synthesis', status: 'done', statusLabel: 'Done', priority: 'high', priorityLabel: 'HIGH', assigneeId: 'user-rasya', projectId: 'p1', projectName: 'Alpha Project', dueDate: 'Jun 10', dueType: 'none', done: true },
    { id: 'task-t15', title: 'Audit existing components', status: 'done', statusLabel: 'Done', priority: 'medium', priorityLabel: 'MED', assigneeId: 'user-rasya', projectId: 'p7', projectName: 'Design System v2', dueDate: 'Jun 12', dueType: 'none', done: true },
    { id: 'task-t16', title: 'Set up CI/CD pipeline', status: 'done', statusLabel: 'Done', priority: 'low', priorityLabel: 'LOW', assigneeId: 'user-rasya', projectId: 'p2', projectName: 'Beta Launch', dueDate: 'Jun 15', dueType: 'none', done: true },
    { id: 'task-t17', title: 'Finalize screen flows', status: 'done', statusLabel: 'Done', priority: 'high', priorityLabel: 'HIGH', assigneeId: 'user-rasya', projectId: 'p3', projectName: 'Mobile App MVP', dueDate: 'May 15', dueType: 'none', done: true },
    { id: 'task-t18', title: 'User interview synthesis', status: 'done', statusLabel: 'Done', priority: 'medium', priorityLabel: 'MED', assigneeId: 'user-rasya', projectId: 'p1', projectName: 'Alpha Project', dueDate: 'May 20', dueType: 'none', done: true },
    { id: 'task-t19', title: 'Typography scale definition', status: 'done', statusLabel: 'Done', priority: 'low', priorityLabel: 'LOW', assigneeId: 'user-rasya', projectId: 'p7', projectName: 'Design System v2', dueDate: 'May 28', dueType: 'none', done: true },
    { id: 'task-t20', title: 'Competitor feature analysis', status: 'done', statusLabel: 'Done', priority: 'medium', priorityLabel: 'MED', assigneeId: 'user-rasya', projectId: 'p2', projectName: 'Beta Launch', dueDate: 'Jun 5', dueType: 'none', done: true },
  ])

  await db.insert(schema.taskLabels).values([
    { id: 'tl-1', taskId: 'task-t1', text: 'UX', color: '' },
    { id: 'tl-2', taskId: 'task-t1', text: 'Design', color: 'amber' },
    { id: 'tl-3', taskId: 'task-t2', text: 'Mobile', color: 'green' },
    { id: 'tl-4', taskId: 'task-t3', text: 'Tokens', color: 'gray' },
    { id: 'tl-5', taskId: 'task-t4', text: 'UX', color: '' },
    { id: 'tl-6', taskId: 'task-t4', text: 'Figma', color: '' },
    { id: 'tl-7', taskId: 'task-t5', text: 'Backend', color: 'gray' },
    { id: 'tl-8', taskId: 'task-t6', text: 'Components', color: 'green' },
    { id: 'tl-9', taskId: 'task-t7', text: 'Mobile', color: 'green' },
    { id: 'tl-10', taskId: 'task-t7', text: 'Dev', color: 'gray' },
    { id: 'tl-11', taskId: 'task-t8', text: 'Docs', color: 'gray' },
    { id: 'tl-12', taskId: 'task-t9', text: 'Handoff', color: 'gray' },
    { id: 'tl-13', taskId: 'task-t12', text: 'UX', color: '' },
  ])

  // ── Critical Issues ────────────────────────────────────────────────────────
  await db.delete(schema.criticalIssues)
  await db.insert(schema.criticalIssues).values([
    { id: 'ci-1', title: 'Auth redesign implementation', subtitle: 'Blocking login flow for new users', project: 'Alpha Project', assigneeName: 'Dito', priority: 'High', priorityLabel: 'HIGH', status: 'Overdue', statusLabel: 'Overdue' },
    { id: 'ci-2', title: 'API rate limit specification', subtitle: 'Missing specs before dev handoff', project: 'Beta Launch', assigneeName: 'Unassigned', priority: 'High', priorityLabel: 'HIGH', status: 'At Risk', statusLabel: 'At Risk' },
    { id: 'ci-3', title: 'Mobile checkout flow blocked', subtitle: 'Payment gateway integration stalled', project: 'Mobile App MVP', assigneeName: 'Dito', priority: 'High', priorityLabel: 'HIGH', status: 'Overdue', statusLabel: 'Overdue' },
    { id: 'ci-4', title: 'Token naming inconsistency', subtitle: 'Affecting component library export', project: 'Design System v2', assigneeName: 'Rasya', priority: 'Medium', priorityLabel: 'MED', status: 'At Risk', statusLabel: 'At Risk' },
  ])

  // ── Docs ────────────────────────────────────────────────────────────────────
  await db.delete(schema.docs)
  await db.insert(schema.docs).values([
    { id: 'doc-1', title: 'Project Alpha — Design Spec', content: '# Design Specification\n\n## Overview\nThis document covers the design requirements for Alpha Project UX redesign.\n\n## Key Decisions\n- Color palette: based on Tailwind v4 default tokens\n- Typography: Geist (Inter fallback)\n- Spacing: 8px base grid', goalId: 'goal-1', projectId: 'p1', taskId: null, createdBy: 'user-rasya', labels: 'Design, Spec', isPublic: false },
    { id: 'doc-2', title: 'Beta Launch Checklist', content: '## Pre-launch\n- [ ] DNS configured\n- [ ] SSL verified\n- [ ] Load test completed\n- [ ] Rollback plan documented\n\n## Post-launch\n- [ ] Monitor errors 24h\n- [ ] User feedback form live', goalId: 'goal-2', projectId: 'p2', taskId: null, createdBy: 'user-maya', labels: 'Launch, Checklist', isPublic: false },
    { id: 'doc-3', title: 'Design Token Reference', content: '## Colors\n- Primary: #2563EB\n- Success: #16A34A\n- Warning: #F59E0B\n- Danger: #DC2626\n\n## Spacing\n- Base: 4px\n- Scale: 4, 8, 12, 16, 24, 32, 48, 64', goalId: 'goal-4', projectId: 'p7', taskId: null, createdBy: 'user-rasya', labels: 'Design, Tokens', isPublic: true },
    { id: 'doc-4', title: 'API Integration Guide', content: '## Authentication\nAll requests require a session cookie.\n\n### Endpoints\n- `GET /api/projects` — list projects\n- `POST /api/tasks` — create task\n- `GET /api/dashboard` — dashboard stats', goalId: 'goal-2', projectId: 'p6', taskId: null, createdBy: 'user-dito', labels: 'API, Guide', isPublic: false },
  ])

  // ── Notifications ───────────────────────────────────────────────────────────
  await db.delete(schema.notifications)
  await db.insert(schema.notifications).values([
    { id: 'notif-1', userId: 'user-rasya', actorId: 'user-dito', entityType: 'task', entityId: 'task-t1', action: 'assigned', message: 'Dito assigned you to "Auth redesign implementation"', isRead: false },
    { id: 'notif-2', userId: 'user-rasya', actorId: 'user-maya', entityType: 'task', entityId: 'task-t4', action: 'commented', message: 'Maya commented on "Produce high-fidelity mockups"', isRead: false },
    { id: 'notif-3', userId: 'user-rasya', actorId: null, entityType: 'task', entityId: 'task-t2', action: 'status_changed', message: '"Mobile checkout flow" is now overdue', isRead: true },
    { id: 'notif-4', userId: 'user-rasya', actorId: 'user-rara', entityType: 'task', entityId: 'task-t9', action: 'mentioned', message: 'Rara mentioned you in "Handoff to engineering"', isRead: false },
    { id: 'notif-5', userId: 'user-maya', actorId: 'user-rasya', entityType: 'project', entityId: 'p1', action: 'status_changed', message: 'Alpha Project status changed to At Risk', isRead: false },
    { id: 'notif-6', userId: 'user-dito', actorId: 'user-maya', entityType: 'task', entityId: 'task-t5', action: 'assigned', message: 'Maya assigned you to "API rate limit specification"', isRead: true },
  ])

  // ── My Day ──────────────────────────────────────────────────────────────────
  await db.delete(schema.myDay)
  await db.insert(schema.myDay).values([
    { id: 'md-1', userId: 'user-rasya', taskId: 'task-t4', date: new Date().toISOString().slice(0, 10) },
    { id: 'md-2', userId: 'user-rasya', taskId: 'task-t5', date: new Date().toISOString().slice(0, 10) },
    { id: 'md-3', userId: 'user-rasya', taskId: 'task-t9', date: new Date().toISOString().slice(0, 10) },
  ])

  // ── Templates ───────────────────────────────────────────────────────────────
  await db.delete(schema.templates)
  await db.insert(schema.templates).values([
    { id: 'tpl-1', name: 'Feature Epic Template', description: 'Standard epic for feature development with default tasks', entityType: 'epic', payload: JSON.stringify({ name: 'Feature Epic', priority: 'medium', description: 'Feature scope and implementation plan' }), createdBy: 'user-rasya', isGlobal: true },
    { id: 'tpl-2', name: 'Bug Fix Task', description: 'Standard bug fix task template', entityType: 'task', payload: JSON.stringify({ priority: 'high', description: 'Steps to reproduce:\n1.\n2.\n3.\n\nExpected behavior:\n\nActual behavior:' }), createdBy: 'user-rasya', isGlobal: true },
    { id: 'tpl-3', name: 'Design Review Task', description: 'Task template for design review cycles', entityType: 'task', payload: JSON.stringify({ priority: 'medium', description: '## Assets\n- Figma file link:\n- Screenshot references:\n\n## Review Criteria\n- [ ] Brand consistency\n- [ ] Component usage\n- [ ] Responsive behavior' }), createdBy: 'user-maya', isGlobal: false },
  ])

  // ── Task Dependencies ───────────────────────────────────────────────────────
  await db.delete(schema.taskDependencies)
  await db.insert(schema.taskDependencies).values([
    { taskId: 'task-t1', dependsOnTaskId: 'task-t12' }, // Auth blocked by IA draft
    { taskId: 'task-t2', dependsOnTaskId: 'task-t7' },  // Checkout blocked by payment gateway
    { taskId: 'task-t5', dependsOnTaskId: 'task-t8' },  // Rate limit spec blocked by release notes
  ])

  // ── Time Entries ────────────────────────────────────────────────────────────
  await db.delete(schema.timeEntries)
  await db.insert(schema.timeEntries).values([
    { id: 'te-1', taskId: 'task-t4', userId: 'user-rasya', hours: 3.5, note: 'Initial mockup wireframes', loggedDate: '2026-06-24' },
    { id: 'te-2', taskId: 'task-t4', userId: 'user-rasya', hours: 2.0, note: 'Polished high-fidelity screens', loggedDate: '2026-06-25' },
    { id: 'te-3', taskId: 'task-t6', userId: 'user-rasya', hours: 1.5, note: 'Exported button and input components', loggedDate: '2026-06-23' },
    { id: 'te-4', taskId: 'task-t8', userId: 'user-rasya', hours: 2.0, note: 'Drafted v2.1 release notes', loggedDate: '2026-06-24' },
  ])

  console.log('✅ Seed complete')
}
