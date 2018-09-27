import { withStaticRoutes } from '@ragg/fleur-route-store'

import { TodoOps } from './domains/Todo/TodoOps';

import { Index } from './pages';


export const RouteStore = withStaticRoutes({
    index: {
        path: '/',
        action: (context) => Promise.all([
            context.executeOperation(TodoOps.fetchTodos, {})
        ]),
        handler: Index
    }
})
