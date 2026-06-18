export interface ProjectSlideOverState {
  isOpen: boolean
  mode: 'create' | 'view'
  projectId: string | null
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
    state.value.isOpen = true
  }

  function openView(projectId: string) {
    state.value.mode = 'view'
    state.value.projectId = projectId
    state.value.isOpen = true
  }

  function close() {
    state.value.isOpen = false
  }

  return {
    state: readonly(state),
    openCreate,
    openView,
    close,
  }
}
