import { operation } from '@ragg/fleur'
import { TodoActions } from './actions'

export const addTodo = operation((context, payload: { title: string }) => {
  context.dispatch(TodoActions.addTodo, payload)
})

export const updateTodoTitle = operation(
  (context, payload: { id: string; title: string }) => {
    context.dispatch(TodoActions.patch, payload)
  },
)

export const destroyTodo = operation((context, payload: { id: string }) => {
  context.dispatch(TodoActions.destroy, payload)
})

export const toggleTodo = operation((context, payload: { id: string }) => {
  context.dispatch(TodoActions.toggle, payload)
})

export const toggleAllTodo = operation(
  (context, payload: { completed: boolean }) => {
    context.dispatch(TodoActions.toggleAll, payload)
  },
)

export const clearCompleted = operation(context => {
  context.dispatch(TodoActions.clearCompleted, {})
})
