import {
  connectToStores,
  ContextProp,
  withComponentContext,
} from '@ragg/fleur-react'
import {
  createBrowserHistory,
  History,
  LocationListener,
  createMemoryHistory,
} from 'history'
import isEqual = require('lodash/isEqual')
import * as React from 'react'
import { navigateOperation } from './navigateOperation'
import { RouteStore } from './RouteStore'
import { MatchedRoute } from './types'

interface ConnectedProps {
  route: MatchedRoute | null
}

type Props = ConnectedProps & ContextProp

const canUseDOM = typeof window !== 'undefined'

export const HistoryHandler = withComponentContext(
  connectToStores(
    [RouteStore],
    (getStore): ConnectedProps => ({
      route: getStore(RouteStore).getCurrentRoute(),
    }),
  )(
    class HistoryHandler extends React.Component<Props> {
      private history: History
      private scrollTimerId: number

      public shouldComponentUpdate(nextProps: Props) {
        const { route } = this.props

        return !route || !nextProps.route || !isEqual(route, nextProps.route)
      }

      public componentDidMount() {
        this.history = canUseDOM
          ? createBrowserHistory({})
          : createMemoryHistory({})
        this.history.listen(this.handleChangeLocation)
        window.addEventListener('scroll', this.handleScroll)
      }

      public componentDidUpdate(prevProps: Props) {
        const { route } = this.props

        if (route && !isEqual(prevProps.route, route)) {
          this.applyRouteToLocation(route)
        }
      }

      private handleScroll = () => {
        if (this.scrollTimerId) {
          clearTimeout(this.scrollTimerId)
        }

        this.scrollTimerId = (setTimeout(() => {
          const { route } = this.props

          if (route) {
            this.history.replace(route.url, {
              scrollX: window.scrollX || window.pageXOffset,
              scrollY: window.scrollY || window.pageYOffset,
            })
          }
        }, 150) as any) as number
      }

      private applyRouteToLocation = (route: MatchedRoute) => {
        console.log(route)
        if (route.type === 'POP') {
          const { state } = this.history.location
          if (state) {
            setTimeout(() => window.scrollTo(state.scrollX, state.scrollY))
          }
        } else if (route.type === 'REPLACE') {
          this.history.replace(route.url, {})
        } else {
          this.history.push(route.url)
        }
      }

      private handleChangeLocation: LocationListener = (
        { pathname },
        action,
      ) => {
        this.props.executeOperation(navigateOperation, {
          type: action,
          url: pathname,
        })
      }

      public render() {
        return null
      }
    },
  ),
)
