export interface ProjectLinkSlideOverState {
  isOpen: boolean
}

export function useProjectLinkSlideOver() {
  const state = useState<ProjectLinkSlideOverState>('project-link-slide-over', () => ({
    isOpen: false,
  }))

  function open() {
    state.value.isOpen = true
  }

  function close() {
    state.value.isOpen = false
  }

  return {
    state: readonly(state),
    open,
    close,
  }
}
