import { withFleurContext, connectToStores, ContextProp } from '@fleur/react'
import React from 'react'
import {} from '@fleur/route-store-dom'

import { TodoStore } from '../domain/Todo/store'
import { TodoFooter } from '../components/Footer'
import { TodoItem } from '../components/TodoItem'
import { ENTER_KEY, TodoFilterType } from '../domain/constants'
import { TodoOps } from '../domain/Todo/operations'
import { AppStore } from '../domain/App/store'
import Router from '../domain/RouteStore'
import { TodoEntity } from '../domain/Todo/types'

interface Props extends ContextProp {
  todos: TodoEntity[]
  editing: string | null
  meta: {
    nowShowing: TodoFilterType
  }
}

export default withFleurContext(
  connectToStores((getStore) => {
    const { currentRoute } = getStore(Router)

    return {
      todos: getStore(TodoStore).getTodos(),
      editing: getStore(AppStore).getEditingTodoId(),
      meta: currentRoute ? currentRoute.meta : {},
    }
  })(
    class IndexComponent extends React.Component<Props> {
      private newFieldRef = React.createRef<HTMLInputElement>()

      private handleNewTodoKeyDown = (event: React.KeyboardEvent) => {
        if (event.keyCode !== ENTER_KEY) {
          return
        }

        event.preventDefault()

        const input = this.newFieldRef.current!
        const val = input.value.trim()

        if (val) {
          this.props.executeOperation(TodoOps.addTodo, { title: val })
          input.value = ''
        }
      }

      get shownTodos(): TodoEntity[] {
        return this.props.todos.filter((todo) => {
          switch (this.props.meta.nowShowing) {
            case TodoFilterType.active:
              return !todo.completed
            case TodoFilterType.completed:
              return todo.completed
            default:
              return true
          }
        })
      }

      get todoCount(): number {
        return this.props.todos.reduce((accum, todo) => {
          return todo.completed ? accum : accum + 1
        }, 0)
      }

      public render() {
        const { todos, meta } = this.props

        const activeTodoCount = this.todoCount
        const completedCount = todos.length - activeTodoCount
        const hasTodo = !!(activeTodoCount || completedCount)

        return (
          <div>
            <header className="header">
              <h1>todos</h1>
              <input
                ref={this.newFieldRef}
                className="new-todo"
                placeholder="What needs to be done?"
                onKeyDown={(e) => this.handleNewTodoKeyDown(e)}
                autoFocus={true}
              />
            </header>
            {todos.length !== 0 && (
              <section className="main">
                <input
                  id="toggle-all"
                  className="toggle-all"
                  type="checkbox"
                  onChange={this.handleToggleAll}
                  checked={activeTodoCount === 0}
                />
                <label htmlFor="toggle-all">Mark all as complete</label>
                <ul className="todo-list">
                  {this.shownTodos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                  ))}
                </ul>
              </section>
            )}
            {hasTodo && (
              <TodoFooter
                count={activeTodoCount}
                completedCount={completedCount}
                nowShowing={meta.nowShowing}
              />
            )}
          </div>
        )
      }

      private handleToggleAll = ({
        currentTarget,
      }: React.ChangeEvent<HTMLInputElement>) => {
        this.props.executeOperation(TodoOps.toggleAllTodo, {
          completed: currentTarget.checked,
        })
      }
    },
  ),
)
