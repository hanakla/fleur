import { createStoreWithStaticRoutes } from '@ragg/fleur-route-store'

import { TodoOps } from './domains/Todo/TodoOps'

import { Index } from './pages/Index'
import { TodosShow } from './pages/TodosShow'

export const RouteStore = createStoreWithStaticRoutes({
  index: {
    path: '/',
    action: context =>
      Promise.all([context.executeOperation(TodoOps.fetchTodos, {})]),
    handler: Index,
  },
  todosShow: {
    path: '/todos/:todoId',
    action: context =>
      Promise.all([context.executeOperation(TodoOps.fetchTodos, {})]),
    handler: TodosShow,
  },
})
