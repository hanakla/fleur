import { listen, Store } from '@ragg/fleur'
import { TodoActions } from './actions'
import { TodoEntity } from './types'

interface State {
  todos: TodoEntity[]
}

export class TodoStore extends Store<State> {
  public static storeName = 'TodoStore'

  protected state: State = {
    todos: [],
  }

  private setTodos = listen(TodoActions.setTodos, ({ todos }) => {
    this.updateWith(state => (state.todos = todos))
  })

  private handleSetTodo = listen(TodoActions.setTodo, payload => {
    this.updateWith(state => {
      state.todos.push(payload.todo)
    })
  })

  public getTodo(id: string): TodoEntity | null {
    return this.state.todos.filter(todo => todo.id === id)[0]
  }

  public getTodos() {
    return this.state.todos
  }
}
