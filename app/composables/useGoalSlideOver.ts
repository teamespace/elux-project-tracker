export interface GoalSlideOverState {
  isOpen: boolean
  mode: 'create' | 'edit'
  goalId: string | null
  draft?: Record<string, unknown>
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
    state.value.draft = undefined
    state.value.isOpen = true
  }

  function openEdit(goalId: string, draft?: Record<string, unknown>) {
    state.value.mode = 'edit'
    state.value.goalId = goalId
    state.value.draft = draft
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
