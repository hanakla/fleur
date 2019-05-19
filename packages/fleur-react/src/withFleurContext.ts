import { ComponentContext } from '@ragg/fleur'
import * as React from 'react'

import { WithRef } from './WithRef'
import { useFleurContext } from './useFleurContext'

export interface ContextProp {
  getStore: ComponentContext['getStore']
  executeOperation: ComponentContext['executeOperation']
}

type ExcludeContextProp<P extends ContextProp> = Pick<
  P,
  Exclude<keyof P, keyof ContextProp>
>

export const withFleurContext = <Props extends ContextProp>(
  Component: React.ComponentType<Props>,
): React.ComponentType<WithRef<ExcludeContextProp<Props>>> => {
  return React.forwardRef((props: any, ref) => {
    const { getStore, executeOperation } = useFleurContext()

    return React.createElement(Component, {
      ref,
      ...props,
      getStore,
      executeOperation,
    })
  })
}
