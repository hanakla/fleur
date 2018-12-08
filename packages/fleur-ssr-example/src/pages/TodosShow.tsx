import { connectToStores } from '@ragg/fleur-react'
import * as React from 'react'

import { TodoStore } from '../domains/Todo/TodoStore'
import { TodoEntity } from '../domains/Todo/types'
import { RouteStore } from '../routes'

interface Props {
  todo: TodoEntity
}

export const TodosShow = connectToStores([TodoStore], (context, props) => {
  const route = context.getStore(RouteStore).getCurrentRoute()
  return {
    todo: context.getStore(TodoStore).getTodo(route.params.todoId),
  }
})(
  class TodosShow extends React.Component<Props> {
    public render() {
      const { todo } = this.props
      // return <div>Details of {todo.title}</div>
      return (
        <h1>
          [{todo.done ? '✅' : '🤔'}] # {todo.id} {todo.title}
        </h1>
      )
    }
  },
)
