import { createRouteStore } from '@ragg/fleur-route-store-dom'
import { TodoFilterType } from './constants'
import { TodoOps } from './Todo/operations'

export default createRouteStore({
  index: {
    path: '/',
    handler: () => import('../routes/Index').then(mod => mod.Index),
    action: ({ executeOperation }) =>
      Promise.all([executeOperation(TodoOps.fetchTodos)]),
    meta: {
      nowShowing: TodoFilterType.all,
    },
  },
  active: {
    path: '/active',
    handler: () => import('../routes/Index').then(mod => mod.Index),
    action: ({ executeOperation }) =>
      Promise.all([executeOperation(TodoOps.fetchTodos)]),
    meta: {
      nowShowing: TodoFilterType.active,
    },
  },
  completed: {
    path: '/completed',
    handler: () => import('../routes/Index').then(mod => mod.Index),
    action: ({ executeOperation }) =>
      Promise.all([executeOperation(TodoOps.fetchTodos)]),
    meta: {
      nowShowing: TodoFilterType.completed,
    },
  },
})
