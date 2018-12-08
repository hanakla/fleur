import { action } from '@ragg/fleur'
import { TodoEntity } from './types'

export const TodoActions = {
  setTodos: action<{ todos: TodoEntity[] }>(),
  setTodo: action<{ todo: TodoEntity }>(),
}
