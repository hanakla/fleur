import immer, { Draft } from 'immer'

import { ActionIdentifier, ExtractPayloadType } from './Action'
import Emitter from './Emitter'
import { StoreContext } from './StoreContext'

export interface StoreClass<T = {}> {
  storeName: string
  new (context: StoreContext): Store<T>
}

export const listen = <A extends ActionIdentifier<any>>(
  action: A,
  producer: (payload: ExtractPayloadType<A>) => void,
) => ({
  __fleurHandler: true,
  __action: action,
  producer,
})

export interface StoreEvents {
  onChange: void
}

export class Store<T = any> extends Emitter<StoreEvents> {
  public static storeName: string = ''

  protected state: T
  protected requestId: number | null = null

  constructor(private context: StoreContext) {
    super()
  }

  public rehydrate(state: any): void {
    this.state = state
  }

  public dehydrate(): any {
    return this.state
  }

  public emitChange(): void {
    this.emit('onChange', void 0)
  }

  protected updateWith(producer: (draft: Draft<T>) => void): void {
    this.state = immer(this.state, draft => {
      producer(draft)
    })

    this.context.enqueueToUpdate(this)
  }
}

export const reducerStore = <S>(
  storeName: string,
  initialStateFactory: () => S,
) => {
  const Sub = class extends Store<S> {
    public static storeName = storeName

    public static listeners: [
      ActionIdentifier<any>,
      (draft: Draft<S>, payload: any) => void
    ][] = []

    public static listen<T extends ActionIdentifier<any>>(
      ident: T,
      producer: (draft: Draft<S>, payload: ExtractPayloadType<T>) => void,
    ) {
      Sub.listeners.push([ident, producer])
      return this
    }

    public state: S

    constructor(context: StoreContext) {
      super(context)

      this.state = initialStateFactory()

      Sub.listeners.forEach(([ident, producer], idx) => {
        ;(this as any)[`__handler${idx}_${ident.name}`] = listen(
          ident,
          payload => {
            this.updateWith(d => producer(d, payload))
          },
        )
      })
    }
  }

  return Sub
}
