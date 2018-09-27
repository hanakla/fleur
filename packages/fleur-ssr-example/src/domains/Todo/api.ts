import axios from 'axios'

import { TodoEntity } from './types'

const HOST = 'http://localhost:8000'

export const getTodos = async (): Promise<TodoEntity[]> => {
    const { data } = await axios.get('/api/todos', { baseURL: HOST })
    return data
}

export const postTodoNew = async (payload: { title: string }): Promise<TodoEntity> => {
    const { data } = await axios.post('/api/todos/new', payload, { baseURL: HOST })
    return data
}
