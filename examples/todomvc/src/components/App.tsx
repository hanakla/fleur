import { connectToStores } from '@ragg/fleur-react'
import { RouteStore } from '../domain/RouteStore'
import React from 'react'
import { Route } from '@ragg/fleur-route-store-dom'

interface Props {
  route: Route
}

class AppComponent extends React.Component<Props> {
  render() {
    const { route } = this.props
    const Handler = route.handler
    console.log(route)
    return <Handler meta={route.meta} />
  }
}

export const App = connectToStores([RouteStore], context => ({
  route: context.getStore(RouteStore).getCurrentRoute(),
}))(AppComponent)
