import { connectToStores } from '@ragg/fleur-react'
import * as React from 'react'

import { TodoEntity } from '@ragg/fleur-ssr-example/src/domains/Todo/types'
import { TodoList } from '../components/TodoList'
import { TodoStore } from '../domains/Todo/TodoStore'

interface ConnectedProps {
  todos: TodoEntity[]
}

export const Index = connectToStores(
  [TodoStore],
  (context): ConnectedProps => ({
    todos: context.getStore(TodoStore).getTodos(),
  }),
)(
  class Index extends React.Component<ConnectedProps> {
    public render() {
      return <TodoList todos={this.props.todos} />
    }
  },
)
