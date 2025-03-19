import { axios } from '../../utils/axios'
import { TodoEntity } from './types'

export const getTodos = async (): Promise<TodoEntity[]> => {
  const { data } = await axios.get('/api/todos')
  return data
}
