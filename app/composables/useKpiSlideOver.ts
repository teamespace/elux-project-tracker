export interface KpiSlideOverState {
  isOpen: boolean
}

export function useKpiSlideOver() {
  const state = useState<KpiSlideOverState>('kpi-slide-over', () => ({
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
