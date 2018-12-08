import { connectToStores } from '@ragg/fleur-react'
import { HistoryHandler, MatchedRoute } from '@ragg/fleur-route-store'
import * as React from 'react'

import { RouteStore } from '../routes'

interface ConnectedProps {
  route: MatchedRoute
}

export const App = connectToStores([RouteStore], context => ({
  route: context.getStore(RouteStore).getCurrentRoute(),
  error: context.getStore(RouteStore).getCurrentNavigateError(),
}))(
  class App extends React.Component<ConnectedProps> {
    public render() {
      const { route } = this.props
      const Handler = route ? route.config.handler : null

      return (
        <div>
          <HistoryHandler />
          {Handler && <Handler />}
        </div>
      )
    }
  },
)
