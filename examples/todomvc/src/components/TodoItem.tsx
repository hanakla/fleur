import React from 'react'
import {
  withComponentContext,
  ContextProp,
  connectToStores,
  StoreGetter,
} from '@ragg/fleur-react'
import { ENTER_KEY, ESCAPE_KEY } from '../domain/constants'
import { TodoEntity } from '../domain/Todo/store'
import classNames from 'classnames'
import {
  updateTodoTitle,
  destroyTodo,
  toggleTodo,
} from '../domain/Todo/operations'
import { setEditTodoId } from '../domain/App/operations'
import { AppStore } from '../domain/App/store'

interface Props extends ContextProp {
  todo: TodoEntity
  key: string
  editing?: boolean
}

interface State {
  editText: string
}

const mapStoresToProps = (getStore: StoreGetter, props: Props) => ({
  editing: getStore(AppStore).getEditingTodoId() === props.todo.id,
})

class TodoItemComponent extends React.Component<Props, State> {
  public state: State = {
    editText: this.props.todo.title,
  }

  private editRef = React.createRef<HTMLInputElement>()

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      nextProps.todo !== this.props.todo ||
      nextProps.editing !== this.props.editing ||
      nextState.editText !== this.state.editText
    )
  }

  public componentDidUpdate(prevProps: Props) {
    if (!prevProps.editing && this.props.editing) {
      const node = this.editRef.current!
      node.focus()
      node.setSelectionRange(node.value.length, node.value.length)
    }
  }

  public render() {
    const { todo, editing } = this.props

    return (
      <li
        className={classNames({
          completed: todo.completed,
          editing: editing,
        })}
      >
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={this.handleChangeCompletion}
          />
          <label onDoubleClick={e => this.handleEdit()}>{todo.title}</label>
          <button className="destroy" onClick={this.handleClickDestroy} />
        </div>
        <input
          ref={this.editRef}
          className="edit"
          value={this.state.editText}
          onBlur={this.handleSubmit}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </li>
    )
  }

  private handleChangeCompletion = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.context.executeOperation(toggleTodo, { id: this.props.todo.id })
  }

  private handleClickDestroy = () => {
    this.props.context.executeOperation(destroyTodo, { id: this.props.todo.id })
  }

  private handleSubmit(event: React.FormEvent) {
    const val = this.state.editText.trim()

    if (val) {
      this.setState({ editText: val })

      this.props.context.executeOperation(updateTodoTitle, {
        id: this.props.todo.id,
        title: this.props.todo.title,
      })
    } else {
      this.props.context.executeOperation(destroyTodo, {
        id: this.props.todo.id,
      })
    }
  }

  private handleEdit() {
    this.props.context.executeOperation(setEditTodoId, {
      id: this.props.todo.id,
    })
    this.setState({ editText: this.props.todo.title })
  }

  private handleKeyDown(event: React.KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      this.setState({ editText: this.props.todo.title })
      this.props.context.executeOperation(setEditTodoId, { id: null })
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit(event)
    }
  }

  private handleChange(event: React.FormEvent) {
    var input: any = event.target
    this.setState({ editText: input.value })
  }
}

export const TodoItem = withComponentContext(
  connectToStores([AppStore], mapStoresToProps)(TodoItemComponent),
)
