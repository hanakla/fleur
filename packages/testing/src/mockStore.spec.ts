import { mockStore } from './mockStore'
import { Store } from '@fleur/fleur'
import { mockOperationContext } from './mockOperationContext'

describe('mockStoreContext', () => {
  it('Should create Store entry correctly', () => {
    class SomeStore extends Store<{ state: string }> {
      static storeName = 'SomeStore'
      public state = { state: '' }
    }

    const actual = mockStore(SomeStore, { state: 'mock' })
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "StoreClass": [Function],
        "name": "SomeStore",
        "store": SomeStore {
          "context": StoreContext {
            "animateId": -1,
            "batch": [Function],
            "dispatchChange": [Function],
            "enqueueToUpdate": [Function],
            "updateQueue": Set {},
          },
          "listeners": Array [],
          "requestId": null,
          "state": Object {
            "state": "mock",
          },
        },
      }
    `)
  })
})
