import { useStore, useComponentContext } from '@fleur/fleur-react'
import { LocationListener } from 'history'
import { useLayoutEffect, useEffect, useCallback } from 'react'
import { navigateOp } from './operations'
import { RouteStore } from './RouteStore'
import { canUseDOM } from './utils'
import { useRouterContext } from './RouterContext'

const useIsomorphicEffect = canUseDOM() ? useLayoutEffect : useEffect

export const HistoryHandler = () => {
  const { history } = useRouterContext()
  const { executeOperation } = useComponentContext()

  const { route, progressRoute } = useStore([RouteStore], getStore => ({
    route: getStore(RouteStore).currentRoute,
    progressRoute: getStore(RouteStore).progressRoute,
  }))

  const handleChangeLocation: LocationListener = useCallback(
    (({ pathname, search, hash, state }, action) => {
      if (state && state.fluerHandled) return

      executeOperation(navigateOp, {
        type: action,
        url: pathname + search + hash,
      })
    }) as LocationListener,
    [],
  )

  // Listen location change
  useIsomorphicEffect(() => {
    const unlisten = history.listen(handleChangeLocation)
    return () => unlisten()
  }, [])

  // Apply current store route to location
  useEffect(
    () => {
      const route = progressRoute

      if (!route) return

      if (route.type === 'POP') {
        const { state } = history.location
        if (state) {
          setTimeout(() => window.scrollTo(state.scrollX, state.scrollY))
        }
      } else if (route.type === 'REPLACE') {
        history.replace(route.url, { fluerHandled: true })
      } else {
        history.push(route.url, { fluerHandled: true })
      }
    },
    [progressRoute],
  )

  // Save scroll position
  useEffect(
    () => {
      let scrollTimerId: number

      const handleScroll = () => {
        if (scrollTimerId) {
          clearTimeout(scrollTimerId)
        }

        scrollTimerId = (setTimeout(() => {
          if (route) {
            history.replace(route.url, {
              scrollX: window.scrollX || window.pageXOffset,
              scrollY: window.scrollY || window.pageYOffset,
            })
          }
        }, 150) as any) as number
      }

      window.addEventListener('scroll', handleScroll, { passive: true })

      return () => {
        window.removeEventListener('scroll', handleScroll)
        clearTimeout(scrollTimerId)
      }
    },
    [route],
  )

  return null
}
