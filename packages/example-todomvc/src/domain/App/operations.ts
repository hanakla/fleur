import { operation } from '@ragg/fleur'
import { AppAction } from './actions'

export const setEditTodoId = operation(
  (context, payload: { id: string | null }) => {
    context.dispatch(AppAction.setEditTodoId, payload)
  },
)
