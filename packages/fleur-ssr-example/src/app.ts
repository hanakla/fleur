import Fleur from '@ragg/fleur'

import { TodoStore } from './domains/Todo/TodoStore'
import { RouteStore } from './routes'

export const app = new Fleur({
  stores: [TodoStore, RouteStore],
})
