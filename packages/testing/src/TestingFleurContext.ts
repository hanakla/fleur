import { FleurContext } from '@fleur/react'
import { createElement, ReactNode } from 'react'
import { AppContext } from '@fleur/fleur'
import { MockedComponentContext } from './mockComponentContext'

export const TestingFleurContext = ({
  value,
  children,
}: {
  value: MockedComponentContext
  children?: ReactNode
}) => {
  return createElement(FleurContext, {
    value: (value as unknown) as AppContext,
    options: { batchedUpdate: () => {}, synchronousUpdate: true },
    children,
  })
}
