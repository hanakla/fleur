import immer, { Draft, enableMapSet } from 'immer'

import { ActionIdentifier, ExtractPayloadType } from './Action'
import { StoreContext } from './StoreContext'

export interface StoreClass<T = {}> {
  storeName: string
  new (context: StoreContext): Store<T>
}

export type ExtractStateOfStoreClass<
  T extends StoreClass<any>
> = T extends StoreClass<infer R> ? R : never

type Listener = () => void

export const listen = <A extends ActionIdentifier<any>>(
  action: A,
  producer: (payload: ExtractPayloadType<A>) => void,
) => ({
  __fleurHandler: true,
  __action: action,
  producer,
})

export class Store<T = any> {
  public static storeName: string = ''

  public state: T
  protected requestId: number | null = null
  private listeners: Listener[] = []

  constructor(protected context: StoreContext) {
    enableMapSet()
  }

  public on(listener: Listener) {
    this.listeners.push(listener)
  }

  public off(listener: Listener) {
    this.listeners = this.listeners.filter((l) => l !== listener)
  }

  /** DO NOT USE THIS, It's internal method */
  public _emit() {
    this.listeners.forEach((listener) => listener())
  }

  public rehydrate(state: any): void {
    this.state = state
  }

  public dehydrate(): any {
    return this.state
  }

  public emitChange(): void {
    this.context.enqueueToUpdate(this)
  }

  protected updateWith(producer: (draft: Draft<T>) => void): void {
    this.state = immer(this.state, (draft) => {
      producer(draft)
    })

    this.context.enqueueToUpdate(this)
  }
}

interface ReducerStoreClass<S> extends StoreClass<S> {
  listen<T extends ActionIdentifier<any>>(
    ident: T,
    producer: (draft: Draft<S>, payload: ExtractPayloadType<T>) => void,
  ): this
}

export const reducerStore = <S>(
  storeName: string,
  initialStateFactory: () => S,
) => {
  const Sub = class extends Store<S> {
    public static storeName = storeName

    private static listeners: [
      ActionIdentifier<any>,
      (draft: Draft<S>, payload: any) => void,
    ][] = []

    public static listen<T extends ActionIdentifier<any>>(
      ident: T,
      producer: (draft: Draft<S>, payload: ExtractPayloadType<T>) => void,
    ) {
      Sub.listeners.push([ident, producer])
      return this
    }

    constructor(protected context: StoreContext) {
      super(context)

      this.state = initialStateFactory()

      Sub.listeners.forEach(([ident, producer], idx) => {
        ;(this as any)[`__handler${idx}_${ident.name}`] = listen(
          ident,
          (payload) => {
            this.updateWith((d) => producer(d, payload))
          },
        )
      })
    }
  }

  return Sub as ReducerStoreClass<S>
}
