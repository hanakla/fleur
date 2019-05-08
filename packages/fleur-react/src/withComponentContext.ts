import { ComponentContext } from '@ragg/fleur'
import * as React from 'react'

import { useComponentContext } from './useComponentContext'

export interface ContextProp {
  context: ComponentContext
}

type ExcludeContextProp<P extends ContextProp> = Pick<
  P,
  Exclude<keyof P, keyof ContextProp>
>

const withComponentContext = <Props extends ContextProp>(
  Component: React.ComponentType<Props>,
): React.ComponentType<ExcludeContextProp<Props>> => {
  return (props: Props) => {
    const { getStore, executeOperation } = useComponentContext()
    const context = React.useMemo(() => ({ getStore, executeOperation }), [
      getStore,
      executeOperation,
    ])

    return React.createElement(Component, {
      ...props,
      context,
    })
  }
}

export { withComponentContext as default }
