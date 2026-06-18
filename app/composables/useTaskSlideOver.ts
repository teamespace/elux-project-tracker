import type { Task } from '~/shared/board'

export interface TaskSlideOverState {
  isOpen: boolean
  mode: 'create' | 'edit' | 'view'
  taskId: string | null
  draft?: Partial<Task>
}

export function useTaskSlideOver() {
  const state = useState<TaskSlideOverState>('task-slide-over', () => ({
    isOpen: false,
    mode: 'create',
    taskId: null,
  }))

  function openCreate(initialData?: Partial<Task>) {
    state.value.mode = 'create'
    state.value.taskId = null
    state.value.draft = initialData
    state.value.isOpen = true
  }

  function openEdit(taskId: string) {
    state.value.mode = 'edit'
    state.value.taskId = taskId
    state.value.draft = undefined
    state.value.isOpen = true
  }

  function openView(taskId: string, initialData?: Partial<Task>) {
    state.value.mode = 'view'
    state.value.taskId = taskId
    state.value.draft = initialData
    state.value.isOpen = true
  }

  function close() {
    state.value.isOpen = false
  }

  return {
    state,
    openCreate,
    openEdit,
    openView,
    close,
  }
}
