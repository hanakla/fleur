import React from 'react'
import { AppContext, Operation, OperationArgs, StoreClass } from '@fleur/fleur'
import { unstable_batchedUpdates } from './utils/batchedUpdates'

export interface ComponentFleurContext {
  executeOperation<O extends Operation>(
    this: void,
    operation: O,
    ...args: OperationArgs<O>
  ): void

  getStore<T extends StoreClass>(this: void, StoreClass: T): InstanceType<T>

  depend<T>(this: void, o: T): T
}

export interface ComponentContextOption {
  batchedUpdate?: (cb: () => void) => void
  synchronousUpdate?: boolean
}

export interface ContextValue {
  synchronousUpdate: boolean
  context: ComponentFleurContext
}

// `null as any` - ignore out of context case
const ComponentReactContext = React.createContext<ContextValue>(null as any)

const FleurContext = ({
  value: context,
  children,
  options: {
    batchedUpdate = unstable_batchedUpdates,
    synchronousUpdate = false,
  } = {},
}: {
  value: AppContext
  children?: React.ReactNode
  options?: ComponentContextOption
}) => {
  React.useMemo(() => {
    context.storeContext.injectBatch(batchedUpdate)
  }, [])

  const componentContext = React.useMemo(
    (): ComponentFleurContext => ({
      executeOperation: (o, ...args) => {
        context.executeOperation(o, ...args)
      },
      getStore: (S) => context.getStore(S),
      depend: (o) => context.depend(o),
    }),
    [context],
  )

  const props = React.useMemo(
    (): { value: ContextValue } => ({
      value: {
        context: componentContext,
        synchronousUpdate,
      },
    }),
    [synchronousUpdate],
  )

  return React.createElement(ComponentReactContext.Provider, props, children)
}

export { ComponentReactContext, FleurContext }
