import { operations } from '@ragg/fleur'
import { TodoActions } from './actions'
import { getTodos } from './api'

export const TodoOps = operations({
  async fetchTodos(context) {
    const todos = await getTodos()
    console.log('Fetch todos')
    context.dispatch(TodoActions.restoreTodos, todos)
  },

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
