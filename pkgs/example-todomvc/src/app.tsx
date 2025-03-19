import Fleur from '@fleur/fleur'
import { AppStore } from './domain/App/store'
import { TodoStore } from './domain/Todo/store'
import Router from './domain/RouteStore'

export const app = new Fleur({
  stores: [AppStore, TodoStore, Router],
})
