import { Store, listen } from '@ragg/fleur'
import { TodoActions } from './actions'
import { TodoEntity } from '@ragg/fleur-ssr-example/src/domains/Todo/types';

interface State {
    todos: TodoEntity[]
}

export class TodoStore extends Store<State> {
    public static storeName = 'TodoStore'

    protected state = {
        todos: []
    }

    private setTodos = listen(TodoActions.setTodos, ({ todos }) => {
        this.updateWith(state => state.todos = todos)
    })

    private handleSetTodo = listen(TodoActions.setTodo, (payload) => {
        this.updateWith(state => { state.todos.push(payload.todo) })
    })

    public getTodos() {
        return this.state.todos
    }
}
