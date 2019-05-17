import Fleur from '@ragg/fleur'
import { AppStore } from './domain/App/store'
import { TodoStore } from './domain/Todo/store'
import { RouteStore } from './domain/RouteStore'

export const app = new Fleur({
  stores: [AppStore, TodoStore, RouteStore],
})
