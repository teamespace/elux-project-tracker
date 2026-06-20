export interface ActivitySlideOverState {
  isOpen: boolean
  view: 'side' | 'center'
}

export function useActivitySlideOver() {
  const state = useState<ActivitySlideOverState>('activity-slide-over', () => ({
    isOpen: false,
    view: 'side',
  }))

  function open() {
    state.value.isOpen = true
    state.value.view = 'side'
  }

  function close() {
    state.value.isOpen = false
  }

  function setView(view: 'side' | 'center') {
    state.value.view = view
  }

  return {
    state,
    open,
    close,
    setView,
  }
}
