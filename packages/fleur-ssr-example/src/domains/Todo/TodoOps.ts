import { operations } from '@ragg/fleur'

import { TodoActions } from './actions'
import { getTodos, postTodoNew } from './api'

export const TodoOps = operations({
  async fetchTodos(context) {
    const todos = await getTodos()
    context.dispatch(TodoActions.setTodos, { todos })
  },

  async addTodo(context, payload: { title: string }) {
    const todo = await postTodoNew(payload)
    context.dispatch(TodoActions.setTodo, { todo })
  },
})
