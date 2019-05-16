import * as React from 'react'
import { HistoryHandler } from './HistoryHandler'

export type RouterContext = {
  status: number
}

type Props = {
  value: RouterContext
  children: React.ReactNode
}

const context = React.createContext<RouterContext>(null as any)

export const createRouterContext = () => ({ status: 200 })

export const RouterContext = ({ value, children }: Props) => {
  return React.createElement(
    React.Fragment,
    {},
    React.createElement(context.Provider, { value }),
    React.createElement(HistoryHandler),
    children,
  )
}
