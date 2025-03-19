import { createRouteStore } from '@fleur/route-store-dom'
import { TodoFilterType } from './constants'
import { TodoOps } from './Todo/operations'

export default createRouteStore({
  index: {
    path: '/',
    handler: () => import('../routes/Index'),
    action: ({ executeOperation }) =>
      Promise.all([executeOperation(TodoOps.fetchTodos)]),
    meta: {
      nowShowing: TodoFilterType.all,
    },
  },
  active: {
    path: '/active',
    handler: () => import('../routes/Index'),
    action: ({ executeOperation }) =>
      Promise.all([executeOperation(TodoOps.fetchTodos)]),
    meta: {
      nowShowing: TodoFilterType.active,
    },
  },
  completed: {
    path: '/completed',
    handler: () => import('../routes/Index'),
    action: ({ executeOperation }) =>
      Promise.all([executeOperation(TodoOps.fetchTodos)]),
    meta: {
      nowShowing: TodoFilterType.completed,
    },
  },
  test: {
    path: '/test',
    handler: () => import('../routes/Test').then((mod) => mod.Test),
  },
})
