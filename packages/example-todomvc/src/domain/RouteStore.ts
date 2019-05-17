import { createRouteStore } from '@ragg/fleur-route-store-dom'
import { TodoFilterType } from './constants'

export const RouteStore = createRouteStore({
  index: {
    path: '/',
    handler: () => import('../routes/Index').then(mod => mod.Index),
    meta: {
      nowShowing: TodoFilterType.all,
    },
  },
  active: {
    path: '/active',
    handler: () => import('../routes/Index').then(mod => mod.Index),
    meta: {
      nowShowing: TodoFilterType.active,
    },
  },
  completed: {
    path: '/completed',
    handler: () => import('../routes/Index').then(mod => mod.Index),
    meta: {
      nowShowing: TodoFilterType.completed,
    },
  },
})
