import { MockStore } from './mockStore'
import { MockContextBase } from './MockContextBase'

export const mockOperationContext = ({
  stores,
  mocks,
}: {
  stores: readonly MockStore[]
  mocks: Map<any, any>
}): MockContextBase => {
  return new MockContextBase({ stores, mocks })
}
