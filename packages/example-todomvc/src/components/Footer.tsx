import { TodoFilterType } from '../domain/constants'
import { pluralize } from '../utils/utils'
import classNames from 'classnames'
import React from 'react'
import { withComponentContext, ContextProp } from '@fleur/fleur-react'
import { TodoOps } from '../domain/Todo/operations'
import { Link } from '@fleur/route-store-dom'

interface Props extends ContextProp {
  completedCount: number
  nowShowing: TodoFilterType
  count: number
}

class TodoFooterComponent extends React.Component<Props, {}> {
  public render() {
    const { nowShowing, completedCount, count } = this.props

    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{count}</strong> {pluralize(count, 'item')} left
        </span>
        <ul className="filters">
          <li>
            <Link
              href="/"
              className={classNames({
                selected: nowShowing === TodoFilterType.all,
              })}
            >
              All
            </Link>
          </li>{' '}
          <li>
            <Link
              href="/active"
              className={classNames({
                selected: nowShowing === TodoFilterType.active,
              })}
            >
              Active
            </Link>
          </li>{' '}
          <li>
            <Link
              href="/completed"
              className={classNames({
                selected: nowShowing === TodoFilterType.completed,
              })}
            >
              Completed
            </Link>
          </li>
        </ul>
        {completedCount > 0 && (
          <button
            className="clear-completed"
            onClick={this.handleClickClearCompleted}
          >
            Clear completed
          </button>
        )}
      </footer>
    )
  }

  private handleClickClearCompleted = () => {
    this.props.executeOperation(TodoOps.clearCompleted)
  }
}

export const TodoFooter = withComponentContext(TodoFooterComponent)
