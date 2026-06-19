export interface GoalSlideOverState {
  isOpen: boolean
  mode: 'create' | 'edit'
  goalId: string | null
}

export function useGoalSlideOver() {
  const state = useState<GoalSlideOverState>('goal-slide-over', () => ({
    isOpen: false,
    mode: 'create',
    goalId: null,
  }))

  function openCreate() {
    state.value.mode = 'create'
    state.value.goalId = null
    state.value.isOpen = true
  }

  function openEdit(goalId: string) {
    state.value.mode = 'edit'
    state.value.goalId = goalId
    state.value.isOpen = true
  }

  function close() {
    state.value.isOpen = false
  }

  return {
    state: readonly(state),
    openCreate,
    openEdit,
    close,
  }
}
