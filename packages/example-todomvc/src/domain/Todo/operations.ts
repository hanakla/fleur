import { operations } from '@ragg/fleur'
import { TodoActions } from './actions'

export const TodoOps = operations({
  addTodo(context, payload: { title: string }) {
    context.dispatch(TodoActions.addTodo, payload)
  },

  updateTodoTitle(context, payload: { id: string; title: string }) {
    context.dispatch(TodoActions.patch, payload)
  },

  destroyTodo(context, payload: { id: string }) {
    context.dispatch(TodoActions.destroy, payload)
  },

  toggleTodo(context, payload: { id: string }) {
    context.dispatch(TodoActions.toggle, payload)
  },

  toggleAllTodo(context, payload: { completed: boolean }) {
    context.dispatch(TodoActions.toggleAll, payload)
  },

  clearCompleted(context) {
    context.dispatch(TodoActions.clearCompleted, {})
  },
})
