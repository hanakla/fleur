import { connectToStores } from '@ragg/fleur-react'
import { RouteStore } from '../domain/RouteStore'
import React from 'react'
import { MatchedRoute, HistoryHandler } from '@ragg/fleur-route-store-dom'

interface Props {
  route: MatchedRoute
}

class AppComponent extends React.Component<Props> {
  render() {
    const { route } = this.props
    const Handler = route ? route.config.handler : null
    return (
      <div>
        <HistoryHandler />
        {Handler ? <Handler meta={route.config.meta} /> : null}
      </div>
    )
  }
}

export const App = connectToStores([RouteStore], context => ({
  route: context.getStore(RouteStore).getCurrentRoute(),
}))(AppComponent)
