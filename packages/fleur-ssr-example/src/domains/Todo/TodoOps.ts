import { operations } from '@ragg/fleur'

import { postTodoNew, getTodos } from './api'
import { TodoActions } from './actions'

export const TodoOps = operations({
    async fetchTodos(context) {
        const todos = await getTodos()
        context.dispatch(TodoActions.setTodos, { todos })
    },

    async addTodo(context, payload: { title: string }) {
        console.log(payload.title)
        const todo = await postTodoNew(payload)
        context.dispatch(TodoActions.setTodo, { todo })
    }
})
