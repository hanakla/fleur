import { ContextProp, withComponentContext } from '@ragg/fleur-react'
import { Link } from '@ragg/fleur-route-store'
import * as React from 'react'

import { TodoOps } from '../domains/Todo/TodoOps'
import { TodoEntity } from '../domains/Todo/types'
import { RouteStore } from '../routes'

interface OwnProps {
  todos: TodoEntity[]
}

type Props = OwnProps & ContextProp

interface State {
  content: string
}

export const TodoList = withComponentContext(
  class TodoList extends React.Component<Props, State> {
    public state: State = {
      content: '',
    }

    public render() {
      const { todos } = this.props
      const routeStore = this.props.context.getStore(RouteStore)

      return (
        <ul>
          {todos.map(todo => (
            <Link href={routeStore.makePath('todosShow', { todoId: todo.id })}>
              <li key={todo.id}>
                {todo.done ? '✅' : '🤔'} {todo.title}
              </li>
            </Link>
          ))}
          <input
            type="text"
            value={this.state.content}
            onChange={this.handleChangeContent}
            onKeyDown={this.handleKeyup}
          />
        </ul>
      )
    }

    private handleChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ content: e.currentTarget.value })
    }

    private handleKeyup = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ((e.nativeEvent as any).isComposing || e.key !== 'Enter') return

      this.props.context.executeOperation(TodoOps.addTodo, {
        title: e.currentTarget.value,
      })

      this.setState({ content: '' })
    }
  },
)
