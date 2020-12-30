import invariant from 'invariant'

import { createAborter } from './Abort'
import { ActionIdentifier, ExtractPayloadType } from './Action'
import Dispatcher from './Dispatcher'
import { Fleur } from './Fleur'
import { OperationContextWithInternalAPI } from './OperationContext'
import { OperationArgs, OperationType } from './Operations'
import { Store, StoreClass } from './Store'
import { StoreContext } from './StoreContext'
import { Aborter } from './Abort'

export interface HydrateState {
  stores: { [storeName: string]: object }
}

export interface StoreGetter {
  <T extends StoreClass<any>>(StoreClass: T): InstanceType<T>
}

interface GetStore {
  (storeName: string): Store
  <T extends StoreClass<any>>(StoreClass: T): InstanceType<T>
}

export class AppContext {
  public readonly dispatcher: Dispatcher
  public readonly storeContext: StoreContext
  public readonly stores: Map<string, Store<any>> = new Map()
  public readonly actionCallbackMap: Map<
    StoreClass,
    Map<ActionIdentifier<any>, ((payload: any) => void)[]>
  > = new Map()
  private readonly abortMap: Map<
    OperationType,
    Map<string | undefined, Aborter>
  > = new Map()

  constructor(private app: Fleur) {
    this.dispatcher = new Dispatcher()
    this.storeContext = new StoreContext()
    this.app.stores.forEach(StoreClass => {
      this.initializeStore(StoreClass)
    })
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

  public depend = <T>(obj: T): T => {
    return obj
  }

  public getStore: GetStore = <T extends StoreClass>(
    StoreClass: T,
  ): InstanceType<T> => {
    const storeName =
      typeof StoreClass === 'string' ? StoreClass : StoreClass.storeName

    if (process.env.NODE_ENV !== 'production') {
      const storeRegistered = this.app.stores.has(storeName)
      invariant(storeRegistered, `Store ${storeName} is must be registered`)
    }

    return (
      (this.stores.get(storeName) as any) || this.initializeStore(storeName)
    )
  }

  public executeOperation = async <O extends OperationType>(
    operation: O,
    ...args: OperationArgs<O>
  ): Promise<void> => {
    const mapOfOp =
      this.abortMap.get(operation) ??
      this.abortMap.set(operation, new Map()).get(operation)!

    let key: string | undefined | null = null
    const aborter = createAborter()

    try {
      const abortable = ({ key: ident }: { key?: string } = {}) => {
        if (mapOfOp.has(ident)) {
          throw new Error(
            'Fleur: Can not call abortable() twice in your Operation',
          )
        }

        mapOfOp.set(ident, aborter)
      }

      await Promise.resolve(
        operation(
          {
            executeOperation: this.executeOperation,
            dispatch: this.dispatch,
            getStore: this.getStore,
            depend: this.depend,
            getExecuteMap: this.getAbortMap,
            abort: aborter.signal,
            abortable,
          } as OperationContextWithInternalAPI,
          ...args,
        ),
      )
    } catch (e) {
      throw e
    } finally {
      aborter.destroy()

      if (key !== null) {
        mapOfOp.delete(key)
      }
    }
  }

  public dispatch = <AI extends ActionIdentifier<any>>(
    actionIdentifier: AI,
    payload: ExtractPayloadType<AI>,
  ) => {
    this.dispatcher.dispatch(actionIdentifier, payload)
  }

  private getAbortMap = (op: OperationType) => {
    return this.abortMap.get(op)
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
