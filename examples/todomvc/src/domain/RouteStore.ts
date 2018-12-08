import { withStaticRoutes } from '@ragg/fleur-route-store'
import { Index } from '../routes/Index'
import { TodoFilterType } from './constants'

export const RouteStore = withStaticRoutes({
  index: {
    path: '/',
    handler: Index,
    meta: {
      nowShowing: TodoFilterType.all,
    },
  },
  active: {
    path: '/active',
    handler: Index,
    meta: {
      nowShowing: TodoFilterType.active,
    },
  },
  completed: {
    path: '/completed',
    handler: Index,
    meta: {
      nowShowing: TodoFilterType.completed,
    },
  },
})
