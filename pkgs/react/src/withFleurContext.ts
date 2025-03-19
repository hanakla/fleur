import React from 'react'

import { WithRef } from './WithRef'
import { useFleurContext } from './useFleurContext'
import { ComponentFleurContext } from './ComponentReactContext'

export interface ContextProp {
  getStore: ComponentFleurContext['getStore']
  executeOperation: ComponentFleurContext['executeOperation']
  depend: ComponentFleurContext['depend']
}

type ExcludeContextProp<P extends ContextProp> = Omit<P, keyof ContextProp>

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
