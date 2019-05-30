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
  public readonly stores: { [storeName: string]: Store<any> } = Object.create(
    null,
  )
  public readonly actionCallbackMap: Map<
    StoreClass,
    Map<ActionIdentifier<any>, ((payload: any) => void)[]>
  > = new Map()

  constructor(private app: Fleur) {
    this.dispatcher = new Dispatcher()
    this.operationContext = new OperationContext(this)
    this.componentContext = new ComponentContext(this)
    this.storeContext = new StoreContext()
    this.app.stores.forEach((_, storeName) => {
      this.initializeStore(storeName)
    })
  }

  public dehydrate(): HydrateState {
    const state: HydrateState = { stores: {} }

    Object.entries(this.stores).forEach(([storeName, store]) => {
      state.stores[storeName] = store.dehydrate()
    })

    return state
  }

  public rehydrate(state: HydrateState) {
    for (const [storeName, hydrateState] of Object.entries(state.stores)) {
      const store = this.getStore(storeName)
      if (store) {
        store.rehydrate(hydrateState)
      }
    }
  }

  public getStore(storeName: string): Store
  public getStore<T extends StoreClass<any>>(StoreClass: T): InstanceType<T>
  public getStore<T extends StoreClass<any>>(
    StoreClass: T | string,
  ): InstanceType<T> {
    const storeName =
      typeof StoreClass === 'string' ? StoreClass : StoreClass.storeName

    invariant(
      storeName != null,
      'Store.storeName must be required in Fleur-style getStore',
    )

    if (process.env.NODE_ENV !== 'production') {
      const storeRegistered = this.app.stores.has(storeName!)
      invariant(storeRegistered, `Store ${storeName} is must be registered`)
    }

    return (this.stores[storeName!] as any) || this.initializeStore(storeName!)
  }

  public getState<T extends { [storeName: string]: any }>() {
    const states = {}
    for (const [key, store] of Object.entries(this.stores)) {
      states[key] = store.state
    }

    return states
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

  public subscribeState(listener: () => void) {
    this.storeContext.on('change', listener)
    return () => this.storeContext.off('change', listener)
  }

  private initializeStore(storeName: string): Store
  private initializeStore<T extends StoreClass<any>>(
    StoreClass: T,
  ): InstanceType<T>
  private initializeStore(StoreClass: StoreClass<any> | string) {
    const storeName =
      typeof StoreClass === 'string' ? StoreClass : StoreClass.storeName

    if (process.env.NODE_ENV !== 'production') {
      const storeRegistered = this.app.stores.has(storeName!)
      invariant(storeRegistered, `Store ${storeName} is must be registered`)
    }

    const StoreConstructor = this.app.stores.get(storeName!)!
    const store = new StoreConstructor(this.storeContext)
    const actionCallbackMap = new Map<
      ActionIdentifier<any>,
      ((payload: any) => void)[]
    >()
    this.stores[storeName!] = store

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
}
