import { actions, action } from '@ragg/fleur'

export const TodoActions = actions('Todo', {
  addTodo: action<{ title: string }>(),
  toggleAll: action<{ completed: boolean }>(),
  toggle: action<{ id: string }>(),
  destroy: action<{ id: string }>(),
  patch: action<{ id: string; title: string }>(),
  clearCompleted: action<{}>(),
})
