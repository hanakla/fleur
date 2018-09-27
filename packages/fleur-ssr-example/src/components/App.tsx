import { connectToStores } from '@ragg/fleur-react'
import * as React from 'react'
import { MatchedRoute } from '@ragg/fleur-route-store'

import { RouteStore } from '../routes'

interface ConnectedProps {
    route: MatchedRoute
}

export const App = connectToStores([RouteStore], (context) => ({
    route: context.getStore(RouteStore).getCurrentRoute(),
}))(class App extends React.Component<ConnectedProps> {
    render() {
        const { route } = this.props
        const Handler = route ? route.config.handler : null

        return (
            <div>
                {Handler && <Handler />}
            </div>
        )
    }
})
