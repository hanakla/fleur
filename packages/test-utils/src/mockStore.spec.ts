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
    expect(actual).toMatchSnapshot()
  })
})
