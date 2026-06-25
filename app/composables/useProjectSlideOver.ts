export interface ProjectSlideOverState {
  isOpen: boolean
  mode: 'create' | 'view' | 'peek'
  projectId: string | null
  draft?: Record<string, any>
}

export function useProjectSlideOver() {
  const state = useState<ProjectSlideOverState>('project-slide-over', () => ({
    isOpen: false,
    mode: 'create',
    projectId: null,
  }))

  function openCreate() {
    state.value.mode = 'create'
    state.value.projectId = null
    state.value.draft = undefined
    state.value.isOpen = true
  }

  function openView(projectId: string) {
    state.value.mode = 'view'
    state.value.projectId = projectId
    state.value.draft = undefined
    state.value.isOpen = true
  }

  function openPeek(projectId: string, draft: Record<string, any>) {
    state.value.mode = 'peek'
    state.value.projectId = projectId
    state.value.draft = draft
    state.value.isOpen = true
  }

  function close() {
    state.value.isOpen = false
  }

  return {
    state: readonly(state),
    openCreate,
    openView,
    openPeek,
    close,
  }
}
