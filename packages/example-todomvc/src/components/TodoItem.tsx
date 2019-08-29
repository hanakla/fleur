import React from 'react'
import {
  withFleurContext,
  ContextProp,
  connectToStores,
  StoreGetter,
} from '@fleur/react'
import { ENTER_KEY, ESCAPE_KEY } from '../domain/constants'
import { TodoEntity } from '../domain/Todo/types'
import classNames from 'classnames'
import { TodoOps } from '../domain/Todo/operations'
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
    this.props.executeOperation(TodoOps.toggleTodo, { id: this.props.todo.id })
  }

  private handleClickDestroy = () => {
    this.props.executeOperation(TodoOps.destroyTodo, { id: this.props.todo.id })
  }

  private handleSubmit(event: React.FormEvent) {
    const val = this.state.editText.trim()

    if (val) {
      this.setState({ editText: val })

      this.props.executeOperation(TodoOps.updateTodoTitle, {
        id: this.props.todo.id,
        title: this.props.todo.title,
      })
    } else {
      this.props.executeOperation(TodoOps.destroyTodo, {
        id: this.props.todo.id,
      })
    }
  }

  private handleEdit() {
    this.props.executeOperation(setEditTodoId, {
      id: this.props.todo.id,
    })
    this.setState({ editText: this.props.todo.title })
  }

  private handleKeyDown(event: React.KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEY) {
      this.setState({ editText: this.props.todo.title })
      this.props.executeOperation(setEditTodoId, { id: null })
    } else if (event.keyCode === ENTER_KEY) {
      this.handleSubmit(event)
    }
  }

  private handleChange(event: React.FormEvent) {
    var input: any = event.target
    this.setState({ editText: input.value })
  }
}

export const TodoItem = withFleurContext(
  connectToStores([AppStore], mapStoresToProps)(TodoItemComponent),
)
