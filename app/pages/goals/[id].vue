// styled: agent-2
<script setup lang="ts">
definePageMeta({ layout: false, title: 'Goal', middleware: 'auth' })

const route = useRoute()
const id = route.params.id as string
const activeTab = ref<'overview' | 'comments' | 'activity'>('overview')
const newCommentText = ref('')
const commentPending = ref(false)

interface GKpi { id: number; name: string; current: number; target: number; unit: string; status: string; statusClass: string; statusLabel?: string; owner: string; oInit: string; oBg: string; oColor: string; dueDate: string }
interface GProject { id: string; name: string; key: string; status: string; statusClass: string; progress: number; tasks: number }
interface GComment { author: string; aInit: string; aBg: string; aColor: string; time: string; text: string }
interface GActivity { id: number; author: string; aInit: string; aBg: string; aColor: string; time: string; text: string; target?: string }
interface GGoal {
  id: string; title: string; description: string; category: string; categoryIcon: string
  owner: string; oInit: string; oBg: string; oColor: string
  dueDate: string; createdDate: string
  status: string; statusClass: string; statusLabel: string
  current: number; target: number; unit: string; progress: number
  kpis: GKpi[]; linkedProjects: GProject[]; comments: GComment[]; activity: GActivity[]
}

const { data: fetchedGoal, pending } = await useAsyncData(`goal-${route.params.id}`, () =>
  $fetch(`/api/goals/${route.params.id}`)
)

const goal = ref<GGoal>(mapGoal(fetchedGoal.value as any))

function mapGoal(g: any): GGoal {
  return {
    id: g?.id ?? '',
    title: g?.title ?? '',
    description: g?.description ?? '',
    category: g?.category ?? '',
    categoryIcon: g?.categoryIcon ?? 'clock',
    owner: g?.owner?.name ?? '',
    oInit: g?.owner?.initials ?? '',
    oBg: '#DBEAFE',
    oColor: '#2563EB',
    dueDate: g?.dueDate ?? '',
    createdDate: g?.createdAt ?? '',
    status: g?.status ?? 'on-track',
    statusClass: g?.status === 'completed' ? 'gs-done' : g?.status === 'at-risk' ? 'gs-risk' : 'gs-track',
    statusLabel: g?.statusLabel ?? '',
    current: g?.progress ?? 0,
    target: 100,
    unit: '',
    progress: g?.progress ?? 0,
    kpis: (g?.kpis ?? []).map((k: any) => ({
      id: Number(k.id),
      name: k.name ?? '',
      current: Number(k.currentValue ?? 0),
      target: Number(k.targetValue ?? 0),
      unit: '',
      status: k.status ?? 'on-track',
      statusClass: k.status === 'completed' ? 'gs-done' : k.status === 'at-risk' ? 'gs-risk' : 'gs-track',
      statusLabel: k.statusLabel ?? '',
      owner: k.owner?.name ?? '',
      oInit: k.owner?.initials ?? '',
      oBg: '#DBEAFE',
      oColor: '#2563EB',
      dueDate: k.dueDate ?? '',
    })),
    linkedProjects: (g?.linkedProjects ?? []).map((p: any) => ({
      id: String(p.id),
      name: p.project ?? p.title ?? '',
      key: (p.project ?? p.title ?? '').substring(0, 4).toUpperCase(),
      status: p.status ?? 'on-track',
      statusClass: p.status === 'completed' ? 'gs-done' : p.status === 'at-risk' ? 'gs-risk' : p.status === 'delayed' ? 'gs-delayed' : 'gs-track',
      progress: p.progress ?? 0,
      tasks: p.taskCount ?? 0,
    })),
    comments: (g?.comments ?? []).map((c: any) => {
      const ca = c.author || {}
      const aname = typeof ca === 'string' ? ca : ca?.name || ''
      return {
        author: aname,
        aInit: ca?.initials || aname.charAt(0) || '?',
        aBg: '#DBEAFE',
        aColor: '#2563EB',
        time: c.createdAt || '',
        text: c.text || '',
      }
    }),
    activity: (g?.activity ?? []).map((a: any) => ({
      id: Number(a.id ?? Date.now()),
      author: a.actor?.name ?? a.author ?? '',
      aInit: a.actor?.initials ?? a.aInit ?? '',
      aBg: '#DBEAFE',
      aColor: '#2563EB',
      time: a.time ?? a.createdAt ?? '',
      text: a.action ?? a.text ?? '',
      target: a.target ?? '',
    })),
  }
}
const kpiDonePct = (kpi: GKpi) => Math.round((kpi.current / kpi.target) * 100)
const showSide = ref(true)

function barColorObj(pct: number): Record<string, string> {
  if (pct >= 80) return { background: '#22C55E' }
  if (pct >= 50) return { background: 'oklch(60.6% 0.25 292.717)' }
  return { background: '#F59E0B' }
}

function kpiStatusLabel(status: string): string {
  switch (status) {
    case 'on-track': return 'On Track'
    case 'at-risk': return 'At Risk'
    case 'delayed': return 'Delayed'
    case 'not-started': return 'Not Started'
    default: return status
  }
}

const { open: openKpiSlideOver } = useKpiSlideOver()
const { open: openProjectLinkSlideOver } = useProjectLinkSlideOver()

function addKpi(payload: import('~/components/KpiCreateContent.vue').KpiPayload) {
  const g = goal.value
  if (!g) return
  g.kpis.push({
    id: g.kpis.length + 1,
    name: payload.name,
    current: payload.current,
    target: payload.target,
    unit: payload.unit,
    status: payload.status,
    statusClass: payload.statusClass,
    statusLabel: payload.statusLabel,
    owner: payload.owner.name,
    oInit: payload.owner.initials,
    oBg: payload.owner.bg,
    oColor: payload.owner.color,
    dueDate: payload.dueDate,
  })
  g.activity.unshift({
    id: Date.now(),
    author: g.owner,
    aInit: g.oInit,
    aBg: g.oBg,
    aColor: g.oColor,
    time: 'Just now',
    text: 'Added KPI',
    target: payload.name,
  })
}

function linkProject(project: import('~/shared/projects').Project) {
  const g = goal.value
  if (!g) return
  if (g.linkedProjects.some(p => p.id === project.id)) return
  g.linkedProjects.push({
    id: project.id,
    name: project.name,
    key: project.key,
    status: project.status,
    statusClass: project.status,
    progress: project.progress,
    tasks: project.openTasks,
  })
  g.activity.unshift({
    id: Date.now(),
    author: g.owner,
    aInit: g.oInit,
    aBg: g.oBg,
    aColor: g.oColor,
    time: 'Just now',
    text: 'Linked project',
    target: project.name,
  })
}

async function addComment() {
  const text = newCommentText.value.trim()
  if (!text) return
  commentPending.value = true
  try {
    await $fetch('/api/comments', {
      method: 'POST',
      body: { parentType: 'goal', parentId: goal.value.id, text },
    })
    goal.value.comments.push({
      author: 'You',
      aInit: 'Y',
      aBg: '#DBEAFE',
      aColor: '#2563EB',
      time: 'Just now',
      text,
    })
    newCommentText.value = ''
  } catch (e) {
    console.error('Failed to post comment:', e)
  } finally {
    commentPending.value = false
  }
}
</script>

<template>
  <NuxtLayout name="default">
    <template #header>
      <AppHeader>
        <template #breadcrumb>
        <div class="pdh-crumb">
          <NuxtLink to="/goals" class="pdh-crumb-link">Goals</NuxtLink>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span class="pdh-crumb-cur">{{ goal.title }}</span>
        </div>
        </template>
      </AppHeader>
    </template>

    <div style="margin:-20px -24px 0;display:flex;flex-direction:column;flex:1;min-height:0">

      <!-- BODY -->
      <div class="gd-body" :class="{ 'gd-body--collapsed': !showSide }">
        <!-- LEFT -->
        <div class="gd-left-col">

          <!-- GOAL HEADER -->
          <div class="gdh">
            <div class="gdh-title-row">
              <div>
                <div class="gdh-title-row2">
                  <div class="gdh-cat-icon">
                    <!-- clock icon -->
                    <svg v-if="goal.categoryIcon === 'clock'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <!-- file icon -->
                    <svg v-else-if="goal.categoryIcon === 'file'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <!-- code icon -->
                    <svg v-else-if="goal.categoryIcon === 'code'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                    <!-- bolt icon -->
                    <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  </div>
                  <div class="gdh-title">{{ goal.title }}</div>
                  <span class="gdh-status-chip" :class="goal.statusClass">
                    <svg v-if="goal.status === 'completed'" width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <span v-else class="gdh-dot"/>
                    {{ goal.statusLabel }}
                  </span>
                </div>
              </div>
              <div class="gdh-actions" />
            </div>

            <!-- meta row -->
            <div class="gdh-meta">
              <div class="gdh-meta-item">
                <div class="gdh-av" :style="{ background: goal.oBg, color: goal.oColor }">{{ goal.oInit }}</div>
                <span>{{ goal.owner }}</span>
              </div>
              <div class="gdh-meta-item">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="1.5" stroke="#9CA3AF" stroke-width="1.4"/><path d="M5 1v3M11 1v3M2 7h12" stroke="#9CA3AF" stroke-width="1.4" stroke-linecap="round"/></svg>
                Due {{ goal.dueDate }}
              </div>
              <div class="gdh-meta-item">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2l1.5 4h4.5l-3.5 2.5 1 4L8 10l-3.5 2.5 1-4L2 6h4.5L8 2z" stroke="#9CA3AF" stroke-width="1.4" stroke-linejoin="round"/></svg>
                {{ goal.category }}
              </div>
              <div class="gdh-prog-row">
                <div class="gdh-prog-track"><div class="gdh-prog-fill" :style="{ width: goal.progress + '%', ...barColorObj(goal.progress) }"/></div>
                <span class="gdh-prog-pct">{{ goal.current }}/{{ goal.target }} {{ goal.unit }}</span>
                <span class="gdh-prog-num">{{ goal.progress }}%</span>
              </div>
            </div>

            <!-- TABS -->
            <div class="gdh-tabs">
              <button class="gdh-tab" :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M5 8h6M5 5.5h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
                Overview
              </button>
              <button class="gdh-tab" :class="{ active: activeTab === 'comments' }" @click="activeTab = 'comments'">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 4l6 5 6-5M2 4h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4z" stroke="currentColor" stroke-width="1.4"/></svg>
                Comments
                <span class="gdh-tab-badge">{{ goal.comments.length }}</span>
              </button>
              <button class="gdh-tab" :class="{ active: activeTab === 'activity' }" @click="activeTab = 'activity'">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M8 5v3.5l2 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
                Activity
              </button>
            </div>
          </div>

          <div class="gd-main">

          <!-- OVERVIEW TAB -->
          <template v-if="activeTab === 'overview'">

            <!-- Description -->
            <div class="gd-section">
              <div class="gd-slabel">Description</div>
              <div class="gd-desc">{{ goal.description }}</div>
            </div>

            <!-- KPIs -->
            <div class="gd-section">
              <div class="gd-kpi-hdr">
                <div class="gd-slabel" style="margin-bottom:0">KPIs</div>
                <button class="gdh-btn-ghost" style="height:26px;padding:0 10px;font-size:11.5px" @click="openKpiSlideOver">
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  Add KPI
                </button>
              </div>

              <div v-if="goal.kpis.length === 0" class="gd-empty-box">No KPIs defined yet.</div>
              <div v-else class="gd-kpi-grid">
                <div v-for="kpi in goal.kpis" :key="kpi.id" class="gd-kpi-card">
                  <div class="gd-kpi-top">
                    <div class="gd-kpi-name">{{ kpi.name }}</div>
                    <span class="gdh-status-chip" :class="kpi.statusClass" style="font-size:10px">
                      <span class="gdh-dot"/>{{ kpi.statusLabel ?? kpiStatusLabel(kpi.status) }}
                    </span>
                  </div>
                  <div class="gd-kpi-nums">
                    <span class="gd-kpi-cur">{{ kpi.current }}</span>
                    <span class="gd-kpi-sep">/</span>
                    <span class="gd-kpi-tgt">{{ kpi.target }} {{ kpi.unit }}</span>
                  </div>
                  <div class="gd-kpi-bar-wrap">
                    <div class="gd-kpi-bar"><div class="gd-kpi-fill" :style="{ width: kpiDonePct(kpi) + '%', ...barColorObj(kpiDonePct(kpi)) }"/></div>
                    <span class="gd-kpi-pct">{{ kpiDonePct(kpi) }}%</span>
                  </div>
                  <div class="gd-kpi-foot">
                    <div class="gd-tav" :style="{ background: kpi.oBg, color: kpi.oColor }">{{ kpi.oInit }}</div>
                    <span class="gd-kpi-owner">{{ kpi.owner }}</span>
                    <span class="gd-kpi-due">· Due {{ kpi.dueDate }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Linked Projects -->
            <div class="gd-section">
              <div class="gd-kpi-hdr">
                <div class="gd-slabel" style="margin-bottom:0">Linked Projects</div>
                <button class="gdh-btn-ghost" style="height:26px;padding:0 10px;font-size:11.5px" @click="openProjectLinkSlideOver">
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  Add project
                </button>
              </div>

              <div v-if="goal.linkedProjects.length === 0" class="gd-empty-box">No projects linked yet.</div>
              <div v-else class="gd-lp-list">
                <NuxtLink v-for="lp in goal.linkedProjects" :key="lp.id" :to="`/projects/${lp.id}`" class="gd-lp-row">
                  <div class="gd-lp-key">{{ lp.key }}</div>
                  <div class="gd-lp-name">{{ lp.name }}</div>
                  <span class="gdh-status-chip" :class="lp.statusClass" style="font-size:10.5px">
                    <span class="gdh-dot"/>{{ lp.status }}
                  </span>
                  <div class="gd-lp-prog">
                    <div class="gd-lp-track"><div class="gd-lp-fill" :style="{ width: lp.progress + '%', ...barColorObj(lp.progress) }"/></div>
                    <span class="gd-lp-pct">{{ lp.progress }}%</span>
                  </div>
                  <div class="gd-lp-tasks">{{ lp.tasks }} tasks</div>
                </NuxtLink>
              </div>
            </div>

          </template>

          <!-- COMMENTS TAB -->
          <template v-if="activeTab === 'comments'">
            <div class="gd-section">
              <div class="gd-slabel">Comments</div>
              <div v-for="(c, i) in goal.comments" :key="i" class="gd-comment">
                <div class="gd-cav" :style="{ background: c.aBg, color: c.aColor }">{{ c.aInit }}</div>
                <div class="gd-cbody">
                  <div class="gd-chead"><span class="gd-cauthor">{{ c.author }}</span><span class="gd-ctime">{{ c.time }}</span></div>
                  <div class="gd-ctext">{{ c.text }}</div>
                </div>
              </div>
              <div v-if="goal.comments.length === 0" class="gd-empty-txt">No comments yet.</div>
              <div class="gd-cinput-row">
                <div class="gd-cav" style="background:#DBEAFE;color:#2563EB">Y</div>
                <input v-model="newCommentText" class="gd-cinput-real" placeholder="Add a comment…" @keydown.enter.prevent="addComment" :disabled="commentPending">
                <button class="gd-send" @click="addComment" :disabled="commentPending || !newCommentText.trim()">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8l12-6-5 12-2-5-5-1z" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
            </div>
          </template>

          <!-- ACTIVITY TAB -->
          <template v-if="activeTab === 'activity'">
            <div class="gd-section">
              <div class="gd-slabel">Activity</div>
              <div v-if="goal.activity.length" class="gd-act-list">
                <div v-for="a in goal.activity" :key="a.id" class="gd-act-row">
                  <div class="gd-act-av" :style="{ background: a.aBg, color: a.aColor }">{{ a.aInit }}</div>
                  <div class="gd-act-body">
                    <span class="gd-act-name">{{ a.author }}</span>
                    <span class="gd-act-time">· {{ a.time }}</span>
                    <div class="gd-act-text">
                      {{ a.text }}
                      <span v-if="a.target" class="gd-act-target">{{ a.target }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="gd-empty-txt">No activity yet.</div>
            </div>
          </template>

        </div>
        </div><!-- /gd-left-col -->

        <!-- RIGHT PANEL -->
        <div class="gd-side" v-show="showSide">
          <div class="gd-side-card">
            <div class="gd-side-card-hdr">
              <span class="gd-panel-title">Properties</span>
              <button class="gd-side-toggle" @click="showSide = false" title="Hide panel">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" stroke-width="1.4"/>
                  <path d="M10.5 2.5v11" stroke="currentColor" stroke-width="1.4"/>
                </svg>
              </button>
            </div>

            <!-- Properties -->
            <div class="gd-panel-sec">
              <div class="gd-panel-hdr">
                <span class="gd-panel-title">Properties</span>
              </div>
              <div class="gd-prop-row">
                <div class="gd-prop-lbl">Status</div>
                <div class="gd-prop-val"><span class="gdh-status-chip" :class="goal.statusClass"><span class="gdh-dot"/>{{ goal.statusLabel }}</span></div>
              </div>
              <div class="gd-prop-row">
                <div class="gd-prop-lbl">Owner</div>
                <div class="gd-prop-val" style="display:flex;align-items:center;gap:6px">
                  <div class="gd-tav" :style="{ background: goal.oBg, color: goal.oColor }">{{ goal.oInit }}</div>
                  {{ goal.owner }}
                </div>
              </div>
              <div class="gd-prop-row">
                <div class="gd-prop-lbl">Due Date</div>
                <div class="gd-prop-val">{{ goal.dueDate }}</div>
              </div>
              <div class="gd-prop-row">
                <div class="gd-prop-lbl">Created</div>
                <div class="gd-prop-val muted">{{ goal.createdDate }}</div>
              </div>
              <div class="gd-prop-row">
                <div class="gd-prop-lbl">Category</div>
                <div class="gd-prop-val">{{ goal.category }}</div>
              </div>
            </div>

            <!-- Progress -->
            <div class="gd-panel-sec">
              <div class="gd-panel-hdr">
                <span class="gd-panel-title">Progress</span>
              </div>
              <div class="gd-progress-block">
                <div class="gd-prog-bar"><div class="gd-prog-bar-fill" :style="{ width: goal.progress + '%', ...barColorObj(goal.progress) }"/></div>
                <div class="gd-prog-lbl">{{ goal.current }} / {{ goal.target }} {{ goal.unit }} · {{ goal.progress }}%</div>
              </div>
            </div>

          </div><!-- /gd-side-card -->
        </div>

        <!-- reopen -->
        <button v-if="!showSide" class="gd-side-reopen" @click="showSide = true" title="Show panel">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" stroke-width="1.4"/>
            <path d="M10.5 2.5v11" stroke="currentColor" stroke-width="1.4"/>
          </svg>
        </button>
      </div>
    </div>

    <KpiSlideOver @submit="addKpi" />
    <ProjectLinkSlideOver :linked-ids="goal.linkedProjects.map(p => p.id)" @link="linkProject" />
  </NuxtLayout>
</template>

<style scoped>
/* ── HEADER ── */
.gdh { background:#fff; border-bottom:1px solid #E5E7EB; padding:20px 32px 0; flex-shrink:0; }
.pdh-crumb { display:flex; align-items:center; gap:6px; font-size:12px; color:#9CA3AF; }
.pdh-crumb-link { color:#6B7280; text-decoration:none; }
.pdh-crumb-link:hover { color:#111827; }
.pdh-crumb-cur { color:#111827; font-weight:500; }
.gdh-title-row { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:12px; }
.gdh-title-row2 { display:flex; align-items:center; gap:10px; }
.gdh-cat-icon { width:28px; height:28px; border-radius:8px; background:oklch(96% 0.04 292.717); color:oklch(60.6% 0.25 292.717); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.gdh-title { font-size:20px; font-weight:600; letter-spacing:-0.025em; color:#111827; line-height:1.2; }
.gdh-actions { display:flex; align-items:center; gap:8px; margin-top:4px; }
.gdh-btn-ghost { display:inline-flex; align-items:center; gap:5px; padding:0 12px; height:30px; border-radius:6px; font-size:12.5px; font-weight:500; cursor:pointer; border:1px solid #E5E7EB; background:transparent; color:#4B5563; font-family:inherit; }
.gdh-btn-ghost:hover { background:#F9FAFB; }
.gdh-btn-primary { display:inline-flex; align-items:center; gap:5px; padding:0 12px; height:30px; border-radius:6px; font-size:12.5px; font-weight:500; cursor:pointer; border:none; background:oklch(60.6% 0.25 292.717); color:#fff; font-family:inherit; }
.gdh-btn-primary:hover { background:oklch(52% 0.27 292.717); }

/* status chips */
.gdh-status-chip { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:20px; font-size:11px; font-weight:500; }
.gdh-dot { width:6px; height:6px; border-radius:2px; flex-shrink:0; background:currentColor; }
.gs-track   { background:#F0FDF4; color:#166534; border:1px solid #BBF7D0; }
.gs-risk    { background:#FFFBEB; color:#92400E; border:1px solid #FDE68A; }
.gs-delayed { background:#FEF2F2; color:#991B1B; border:1px solid #FECACA; }
.gs-done    { background:oklch(96% 0.04 292.717); color:oklch(52% 0.27 292.717); border:1px solid oklch(85% 0.13 292.717); }
.gs-new     { background:#F9FAFB; color:#6B7280; border:1px solid #E5E7EB; }

/* meta */
.gdh-meta { display:flex; align-items:center; gap:16px; margin-bottom:16px; flex-wrap:wrap; }
.gdh-meta-item { display:flex; align-items:center; gap:5px; font-size:12px; color:#4B5563; }
.gdh-av { width:20px; height:20px; border-radius:50%; font-size:9px; font-weight:600; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

/* progress inline */
.gdh-prog-row { display:flex; align-items:center; gap:8px; }
.gdh-prog-track { width:80px; height:4px; background:#F3F4F6; border-radius:2px; overflow:hidden; }
.gdh-prog-fill { height:100%; border-radius:2px; }
.gdh-prog-pct { font-size:11.5px; color:#6B7280; }
.gdh-prog-num { font-size:12px; font-weight:600; color:#111827; }

/* tabs */
.gdh-tabs { display:flex; align-items:center; border-top:1px solid #F3F4F6; margin-top:4px; }
.gdh-tab { display:flex; align-items:center; gap:5px; padding:0 2px; height:38px; margin-right:20px; font-size:12.5px; font-weight:500; color:#9CA3AF; cursor:pointer; border:none; border-bottom:2px solid transparent; user-select:none; background:transparent; font-family:inherit; }
.gdh-tab:hover { color:#4B5563; }
.gdh-tab.active { color:oklch(60.6% 0.25 292.717); border-bottom-color:oklch(60.6% 0.25 292.717); }
.gdh-tab-badge { font-size:10px; font-weight:600; background:oklch(96% 0.04 292.717); color:oklch(60.6% 0.25 292.717); padding:1px 5px; border-radius:10px; }
.gdh-tab:not(.active) .gdh-tab-badge { background:#F3F4F6; color:#9CA3AF; }

/* ── BODY ── */
.gd-body { flex:1; display:grid; grid-template-columns:1fr 300px; min-height:0; overflow:hidden; position:relative; background:#fff; }
.gd-body--collapsed { grid-template-columns:1fr; }
.gd-left-col { display:flex; flex-direction:column; overflow:hidden; min-height:0; background:#fff; }
.gd-main { padding:24px 32px; overflow-y:auto; flex:1; }
.gd-side { padding:20px 12px 16px; overflow-y:auto; background:#fff; }
.gd-side-card-hdr { display:flex; align-items:center; justify-content:space-between; padding:8px 16px 4px; }
.gd-side-toggle { display:flex; align-items:center; justify-content:center; width:24px; height:24px; border-radius:6px; border:1px solid #E5E7EB; background:#fff; color:#6B7280; cursor:pointer; }
.gd-side-toggle:hover { background:#F3F4F6; color:#111827; }
.gd-side-card { background:#fff; border:1px solid #E5E7EB; border-radius:12px; overflow:hidden; }
.gd-side-reopen { position:absolute; top:16px; right:16px; display:flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:7px; border:1px solid #E5E7EB; background:#fff; color:#6B7280; cursor:pointer; }
.gd-side-reopen:hover { background:#F3F4F6; color:#111827; }
.gd-panel-sec { padding:14px 16px; border-top:1px solid #E5E7EB; }
.gd-panel-hdr { margin-bottom:8px; }
.gd-panel-title { font-size:10.5px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#9CA3AF; }

/* sections */
.gd-section { margin-bottom:28px; }
.gd-slabel { font-size:11px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; color:#9CA3AF; margin-bottom:12px; }

/* desc */
.gd-desc { font-size:13.5px; line-height:1.65; color:#4B5563; padding:14px 16px; border:1px solid #E5E7EB; border-radius:8px; min-height:70px; cursor:text; }
.gd-desc:hover { border-color:#D1D5DB; }

/* kpi header */
.gd-kpi-hdr { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }

/* kpi grid */
.gd-kpi-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:12px; }
.gd-kpi-card { border:1px solid #E5E7EB; border-radius:10px; padding:14px 16px; background:#fff; }
.gd-kpi-top { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; margin-bottom:8px; }
.gd-kpi-name { font-size:12.5px; font-weight:600; color:#111827; }
.gd-kpi-nums { display:flex; align-items:baseline; gap:3px; margin-bottom:8px; }
.gd-kpi-cur { font-size:22px; font-weight:700; color:#111827; line-height:1; }
.gd-kpi-sep { font-size:14px; color:#D1D5DB; }
.gd-kpi-tgt { font-size:13px; color:#9CA3AF; }
.gd-kpi-bar-wrap { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.gd-kpi-bar { flex:1; height:4px; background:#F3F4F6; border-radius:2px; overflow:hidden; }
.gd-kpi-fill { height:100%; border-radius:2px; }
.gd-kpi-pct { font-size:11px; color:#9CA3AF; width:28px; text-align:right; }
.gd-kpi-foot { display:flex; align-items:center; gap:5px; }
.gd-tav { width:18px; height:18px; border-radius:50%; font-size:8px; font-weight:600; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.gd-kpi-owner { font-size:11px; color:#4B5563; }
.gd-kpi-due { font-size:11px; color:#9CA3AF; }

/* linked projects */
.gd-lp-list { border:1px solid #E5E7EB; border-radius:8px; overflow:hidden; }
.gd-lp-row { display:flex; align-items:center; gap:12px; padding:10px 14px; border-bottom:1px solid #F3F4F6; text-decoration:none; color:inherit; cursor:pointer; }
.gd-lp-row:last-child { border-bottom:none; }
.gd-lp-row:hover { background:#F9FAFB; }
.gd-lp-key { font-family:ui-monospace,monospace; font-size:10px; font-weight:600; background:#F3F4F6; color:#6B7280; padding:2px 6px; border-radius:4px; flex-shrink:0; }
.gd-lp-name { flex:1; font-size:13px; font-weight:500; color:#111827; }
.gd-lp-prog { display:flex; align-items:center; gap:6px; }
.gd-lp-track { width:60px; height:3px; background:#F3F4F6; border-radius:2px; overflow:hidden; }
.gd-lp-fill { height:100%; border-radius:2px; }
.gd-lp-pct { font-size:11px; color:#9CA3AF; }
.gd-lp-tasks { font-size:11px; color:#9CA3AF; flex-shrink:0; }

/* empty states */
.gd-empty-box { border:1px dashed #E5E7EB; border-radius:8px; padding:24px; text-align:center; color:#9CA3AF; font-size:13px; }
.gd-empty-txt { color:#9CA3AF; font-size:13px; padding:12px 0; }

/* comments */
.gd-comment { display:flex; gap:10px; margin-bottom:16px; }
.gd-cav { width:28px; height:28px; border-radius:50%; font-size:10px; font-weight:600; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.gd-cbody { flex:1; background:#fff; border:1px solid #E5E7EB; border-radius:8px; padding:10px 14px; }
.gd-chead { display:flex; align-items:baseline; gap:6px; margin-bottom:5px; }
.gd-cauthor { font-size:12.5px; font-weight:600; }
.gd-ctime { font-size:11px; color:#9CA3AF; }
.gd-ctext { font-size:13px; color:#4B5563; line-height:1.5; }
.gd-cinput-row { display:flex; gap:10px; align-items:flex-start; margin-top:16px; }
.gd-cinput { flex:1; border:1px solid #E5E7EB; border-radius:8px; padding:9px 14px; font-size:13px; color:#9CA3AF; cursor:text; min-height:40px; }
.gd-cinput:hover { border-color:#D1D5DB; }
.gd-cinput-real { flex:1; border:1px solid #E5E7EB; border-radius:8px; padding:9px 14px; font-size:13px; color:#111827; font-family:inherit; outline:none; background:transparent; min-height:40px; }
.gd-cinput-real::placeholder { color:#9CA3AF; }
.gd-cinput-real:hover { border-color:#D1D5DB; }
.gd-cinput-real:focus { border-color:oklch(60.6% 0.25 292.717); }
.gd-send { width:32px; height:32px; background:oklch(60.6% 0.25 292.717); border:none; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; margin-top:1px; padding:0; }
.gd-send:hover { background:oklch(52% 0.27 292.717); }
.gd-send:disabled { opacity:0.4; cursor:not-allowed; }

/* activity */
.gd-act-list { display:flex; flex-direction:column; gap:14px; }
.gd-act-row { display:flex; align-items:flex-start; gap:10px; }
.gd-act-av { width:28px; height:28px; border-radius:50%; font-size:10px; font-weight:600; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.gd-act-body { flex:1; }
.gd-act-name { font-size:12.5px; font-weight:600; color:#111827; }
.gd-act-time { font-size:11px; color:#9CA3AF; margin-left:5px; }
.gd-act-text { font-size:12.5px; color:#4B5563; margin-top:1px; }
.gd-act-target { font-style:italic; color:#111827; }

/* ── PROPERTIES ── */
.gd-prop-row { display:flex; align-items:center; justify-content:space-between; min-height:30px; border-radius:6px; padding:2px 4px; margin-bottom:1px; cursor:pointer; }
.gd-prop-row:hover { background:#F9FAFB; }
.gd-prop-lbl { width:76px; flex-shrink:0; font-size:11.5px; font-weight:500; color:#9CA3AF; }
.gd-prop-val { font-size:12.5px; color:#111827; display:flex; align-items:center; }
.gd-prop-val.muted { color:#9CA3AF; }
.gd-progress-block { width:100%; padding:2px 4px 4px; }
.gd-prog-bar { height:4px; background:#F3F4F6; border-radius:2px; overflow:hidden; margin-bottom:4px; }
.gd-prog-bar-fill { height:100%; border-radius:2px; }
.gd-prog-lbl { font-size:11px; color:#9CA3AF; }
</style>
