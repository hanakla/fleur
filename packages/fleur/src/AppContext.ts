import * as invariant from 'invariant'

import { ActionIdentifier, ExtractPayloadType } from './Action'
import { ComponentContext } from './ComponentContext'
import Dispatcher from './Dispatcher'
import { Fleur } from './Fleur'
import { OperationContext } from './OperationContext'
import { Operation, OperationArgs } from './Operations'
import { Store, StoreClass } from './Store'
import { StoreContext } from './StoreContext'

export interface HydrateState {
  stores: { [storeName: string]: object }
}

export class AppContext {
  public readonly dispatcher: Dispatcher
  public readonly operationContext: OperationContext
  public readonly componentContext: ComponentContext
  public readonly storeContext: StoreContext
  public readonly stores: Map<string, Store<any>> = new Map()
  private readonly stateProxy: Record<string, any>
  public readonly actionCallbackMap: Map<
    StoreClass,
    Map<ActionIdentifier<any>, ((payload: any) => void)[]>
  > = new Map()

  constructor(private app: Fleur) {
    this.dispatcher = new Dispatcher()
    this.operationContext = new OperationContext(this)
    this.componentContext = new ComponentContext(this)
    this.storeContext = new StoreContext()
    this.app.stores.forEach(StoreClass => {
      this.initializeStore(StoreClass)
    })
    this.stateProxy = this.createStateProxy()
  }

  public dehydrate(): HydrateState {
    const state: HydrateState = { stores: {} }

    this.stores.forEach((store, storeName) => {
      state.stores[storeName] = store.dehydrate()
    })

    return state
  }

  public rehydrate(state: HydrateState) {
    this.stores.forEach((_, storeName) => {
      if (!state.stores[storeName]) return
      this.stores.get(storeName)!.rehydrate(state.stores[storeName])
    })
  }

  public getStore(storeName: string): Store
  public getStore<T extends StoreClass<any>>(StoreClass: T): InstanceType<T>
  public getStore<T extends StoreClass<any>>(
    store: T | string,
  ): InstanceType<T> {
    const storeName =
      typeof store === 'string' ? store : this.app.storeClassToName.get(store)!

    if (process.env.NODE_ENV !== 'production') {
      invariant(!!storeName, `Store ${storeName} is must be registered`)
    }

    return (
      (this.stores.get(storeName) as any) || this.initializeStore(storeName)
    )
  }

  public getState<T extends Record<string, any>>(): T {
    return this.stateProxy as T
  }

  public async executeOperation<O extends Operation>(
    operation: O,
    ...args: OperationArgs<O>
  ): Promise<void> {
    await Promise.resolve(operation(this.operationContext, ...args))
  }

  public dispatch<AI extends ActionIdentifier<any>>(
    actionIdentifier: AI,
    payload: ExtractPayloadType<AI>,
  ) {
    this.dispatcher.dispatch(actionIdentifier, payload)
  }

  public subscribe(listener: () => void) {
    this.storeContext.on('change', listener)
    return () => this.storeContext.off('change', listener)
  }

  private initializeStore(storName: string): Store
  private initializeStore<T extends StoreClass<any>>(
    StoreClass: T,
  ): InstanceType<T>
  private initializeStore(StoreClass: StoreClass<any> | string) {
    const storeName =
      typeof StoreClass === 'string'
        ? StoreClass
        : this.app.storeClassToName.get(StoreClass)!

    if (process.env.NODE_ENV !== 'production') {
      const storeRegistered = this.app.stores.has(storeName)
      invariant(storeRegistered, `Store ${storeName} is must be registered`)
    }

    const StoreConstructor = this.app.stores.get(storeName)!
    const store = new StoreConstructor(this.storeContext)
    const actionCallbackMap = new Map<
      ActionIdentifier<any>,
      ((payload: any) => void)[]
    >()
    this.stores.set(storeName, store)

    Object.keys(store)
      .filter(
        key =>
          (store as any)[key] != null && (store as any)[key].__fleurHandler,
      )
      .forEach(key => {
        const actionIdentifier = (store as any)[key].__action
        const actionCallbacks = actionCallbackMap.get(actionIdentifier) || []

        actionCallbacks.push((store as any)[key].producer)
        actionCallbackMap.set(actionIdentifier, actionCallbacks)
      })

    this.actionCallbackMap.set(StoreConstructor, actionCallbackMap)

    this.dispatcher.listen(action => {
      const actionCallbackMap = this.actionCallbackMap.get(StoreConstructor)!
      const handlers = actionCallbackMap.get(action.type)
      if (handlers) {
        for (const handler of handlers) handler(action.payload)
      }
    })

    return store
  }

  private createStateProxy() {
    const properties = [...this.stores].reduce<PropertyDescriptorMap>(
      (accum, [storeName]) => {
        accum[storeName] = {
          get: () => this.getStore(storeName).state,
          set: () => {
            throw new Error("Can't assign value into root store")
          },
          enumerable: true,
          configurable: false,
        }
        return accum
      },
      {},
    )

    return Object.defineProperties({}, properties)
  }
}
