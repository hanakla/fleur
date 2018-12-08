import { actions, action } from '@ragg/fleur'

export const AppAction = actions('App', {
  setEditTodoId: action<{ id: string | null }>(),
})
