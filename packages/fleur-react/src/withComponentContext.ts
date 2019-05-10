import { ComponentContext } from '@ragg/fleur'
import * as React from 'react'

import { WithRef } from './WithRef'
import { useComponentContext } from './useComponentContext'

export interface ContextProp {
  getStore: ComponentContext['getStore']
  executeOperation: ComponentContext['executeOperation']
}

type ExcludeContextProp<P extends ContextProp> = Pick<
  P,
  Exclude<keyof P, keyof ContextProp>
>

const withComponentContext = <Props extends ContextProp>(
  Component: React.ComponentType<Props>,
): React.ComponentType<WithRef<ExcludeContextProp<Props>>> => {
  return React.forwardRef((props: any, ref) => {
    const { getStore, executeOperation } = useComponentContext()

    return React.createElement(Component, {
      ref,
      ...props,
      getStore,
      executeOperation,
    })
  })
}

export { withComponentContext as default }
