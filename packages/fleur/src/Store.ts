import immer, { Draft } from 'immer'

import { ActionIdentifier, ExtractPayloadType } from './Action'
import Emitter from './Emitter'
import { StoreContext } from './StoreContext'
import { action } from '../typings'

export interface StoreClass<T = {}> {
  storeName: string
  new (context: StoreContext): Store<T>
}

type DispatchListener = {
  __fleurHandler: true
  __action: ActionIdentifier<any>
  producer: (payload: object) => void
}

export const listen = <A extends ActionIdentifier<any>>(
  action: A,
  producer: (payload: ExtractPayloadType<A>) => void,
): DispatchListener => ({
  __fleurHandler: true,
  __action: action,
  producer,
})

export interface StoreEvents {
  onChange: void
}

export default class Store<T = any> extends Emitter<StoreEvents> {
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

// type Reducer

// export const store = <T>(storeName: string, reducer: ) => {
//   return class extends Store<T> {
//     public static storeName = storeName

//     constructor(context: StoreContext) {
//       super(context)

//       defs.forEach((listener, idx) => {
//         ;(this as any)[`__listener$${idx}`] = listener
//       })
//     }
//   }
// }

const a = action<{ a: string }>()

type State = { b: string }

const store = <S>(storeName: string) => {

  return class extends Store<S> {
    public static storeName = storeName
    public static listeners = []
    public static listen<T extends ActionIdentifier<any>(ident: T, producer: (payload: ExtractPayloadType<T>, state: State) => void) {

    }

    constructor(context: StoreContext) {
      super(context)
      this
    }
  }
}

store<State>('TestStore')
  .listen(a, (state) => {})
  .listen(a, (state) => {})
