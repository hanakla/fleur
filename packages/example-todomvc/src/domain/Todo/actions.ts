import { actions, action } from '@fleur/fleur'
import { TodoEntity } from './types'

export const TodoActions = actions('Todo', {
  restoreTodos: action<TodoEntity[]>(),
  addTodo: action<{ title: string }>(),
  toggleAll: action<{ completed: boolean }>(),
  toggle: action<{ id: string }>(),
  destroy: action<{ id: string }>(),
  patch: action<{ id: string; title: string }>(),
  clearCompleted: action<{}>(),
})
