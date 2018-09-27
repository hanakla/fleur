import * as React from 'react'
import { withComponentContext, ContextProp } from '@ragg/fleur-react'

import { TodoEntity } from '../domains/Todo/types'
import { TodoOps } from '@ragg/fleur-ssr-example/src/domains/Todo/TodoOps';

interface OwnProps {
    todos: TodoEntity[]
}

type Props = OwnProps & ContextProp

interface State {
    content: string
}

export const TodoList = withComponentContext(class TodoList extends React.Component<Props, State> {
    state: State = {
        content: ''
    }

    render() {
        const { todos } = this.props

        return (
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        {todo.done ? '✅' : '🤔'} {todo.title}
                    </li>
                ))}
                <input
                    type='text'
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
            title: e.currentTarget.value
        })

        this.setState({ content: '' })
    }
})
