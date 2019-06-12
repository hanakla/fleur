import Fleur, { RootStateType } from '@fleur/fleur'
import { AppStore } from './domain/App/store'
import { TodoStore } from './domain/Todo/store'
import Router from './domain/RouteStore'

export const app = new Fleur({
  stores: {
    app: AppStore,
    todo: TodoStore,
    router: Router,
  },
})

export type RootState = RootStateType<{
  todo: TodoStore
}>
