import { Store, listen } from '@fleur/fleur'
import { AppAction } from './actions'

interface State {
  editTodoId: string | null
}

export class AppStore extends Store<State> {
  static storeName = 'AppStore'
  public state = {
    editTodoId: null,
  }

  private handleSetEditTodoId = listen(AppAction.setEditTodoId, ({ id }) => {
    this.updateWith(s => (s.editTodoId = id))
  })

  public getEditingTodoId() {
    return this.state.editTodoId
  }
}
