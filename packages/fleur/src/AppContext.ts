import * as invariant from 'invariant'

import { ActionIdentifier, ExtractPayloadType } from './Action'
import { ComponentContext } from './ComponentContext'
import Dispatcher from './Dispatcher'
import { Fleur } from './Fleur'
import { OperationContext } from './OperationContext'
import { Operation, OperationArgs } from './Operations'
import { Store, StoreClass, ExtractStateOfStoreClass } from './Store'
import { StoreContext } from './StoreContext'

export type StoreGetter = <T extends StoreClass<any>>(
  StoreClass: T,
) => ExtractStateOfStoreClass<T>

export interface HydrateState {
  stores: { [storeName: string]: object }
}

export class AppContext {
  public readonly dispatcher: Dispatcher
  public readonly operationContext: OperationContext
  public readonly componentContext: ComponentContext
  public readonly storeContext: StoreContext
  public readonly stores: Map<string, Store<any>> = new Map()
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

    this.getStore = this.getStore.bind(this)
    this.getStoreInstance = this.getStoreInstance.bind(this)
    this.executeOperation = this.executeOperation.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }

  public dehydrate(): HydrateState {
    const state: HydrateState = { stores: {} }

    this.stores.forEach((store, storeName) => {
      state.stores[storeName] = store.dehydrate()
    })

    return state
  }

  public rehydrate(state: HydrateState) {
    this.app.stores.forEach(StoreClass => {
      if (!state.stores[StoreClass.storeName]) return

      if (!this.stores.has(StoreClass.storeName)) {
        this.initializeStore(StoreClass)
      }

      this.stores
        .get(StoreClass.storeName)!
        .rehydrate(state.stores[StoreClass.storeName])
    })
  }

  public getStore(storeName: string): any
  public getStore<T extends StoreClass<any>>(
    StoreClass: T,
  ): ExtractStateOfStoreClass<T>
  public getStore<T extends StoreClass<any>>(
    StoreClass: T | string,
  ): ExtractStateOfStoreClass<T> {
    const storeName =
      typeof StoreClass === 'string' ? StoreClass : StoreClass.storeName

    if (process.env.NODE_ENV !== 'production') {
      const storeRegistered = this.app.stores.has(storeName)
      invariant(storeRegistered, `Store ${storeName} is must be registered`)
    }

    const store = this.getStoreInstance(storeName)
    return store.state
  }

  public getStoreInstance(storeName: string): any
  public getStoreInstance<T extends StoreClass<any>>(
    StoreClass: T,
  ): InstanceType<T>
  public getStoreInstance<T extends StoreClass<any>>(
    StoreClass: T | string,
  ): InstanceType<T> {
    const storeName =
      typeof StoreClass === 'string' ? StoreClass : StoreClass.storeName

    if (process.env.NODE_ENV !== 'production') {
      const storeRegistered = this.app.stores.has(storeName)
      invariant(storeRegistered, `Store ${storeName} is must be registered`)
    }

    const store = (this.stores.get(storeName) ||
      this.initializeStore(storeName)) as InstanceType<T>
    return store
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

  private initializeStore(storName: string): Store
  private initializeStore<T extends StoreClass<any>>(
    StoreClass: T,
  ): InstanceType<T>
  private initializeStore(StoreClass: StoreClass<any> | string) {
    const storeName =
      typeof StoreClass === 'string' ? StoreClass : StoreClass.storeName

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
}
