import { Operation, OperationArgs } from '@fleur/fleur'
import { ActionIdentifier } from '@fleur/fleur'
import { MockStore } from './mockStore'
import { MockContextBase } from './MockContextBase'

export class MockOperationContext extends MockContextBase {
  public dispatchs: { action: ActionIdentifier<any>; payload: any }[] = []

  public executeOperation = async <O extends Operation>(
    operation: O,
    ...args: OperationArgs<O>
  ): Promise<void> => {
    await Promise.resolve(operation(this as any, ...args))
  }

  public dispatch = <AI extends ActionIdentifier<any>>(
    action: AI,
    payload: ReturnType<AI>,
  ): void => {
    this.dispatchs.push({ action, payload })
    this.mockStores.forEach(({ store }) => {
      Object.keys(store)
        .filter(
          key =>
            (store as any)[key] != null && (store as any)[key].__fleurHandler,
        )
        .forEach(key => {
          if ((store as any)[key].__action === action) {
            ;(store as any)[key].producer(payload)
          }
        })
    })
  }
}

export const mockOperationContext = ({
  stores,
}: {
  stores: MockStore[]
}): MockOperationContext => {
  return new MockOperationContext({ stores })
}
