import React, { useContext } from 'react'
import { HistoryHandler } from './HistoryHandler'

type RouterContextValue = {
  status: number
}

const context = React.createContext<RouterContextValue>(null as any)

export const createRouterContext = () => ({ status: 200 })

export const useRouterContext = () => {
  return useContext(context)
}

export const RouterContext = ({
  value,
  children,
}: {
  value: RouterContextValue
  children: React.ReactNode
}) => {
  return React.createElement(
    React.Fragment,
    {},
    React.createElement(context.Provider, { value }),
    React.createElement(HistoryHandler),
    children,
  )
}
