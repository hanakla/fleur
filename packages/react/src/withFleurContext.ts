import { ComponentContext } from '@fleur/fleur'
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
): React.ComponentType<ExcludeContextProp<WithRef<Props>>> => {
  return React.forwardRef((props: any, ref) => {
    const { getStore, executeOperation, depend } = useFleurContext()

    return React.createElement(Component, {
      ref,
      ...props,
      getStore,
      depend,
      executeOperation,
    })
  })
}
