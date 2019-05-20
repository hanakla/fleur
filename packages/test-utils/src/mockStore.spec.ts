import { mockStore } from './mockStore'
import { Store } from '@fleur/fleur'

describe('mockStoreContext', () => {
  it('Should create Store entry correctly', () => {
    class SomeStore extends Store<{ state: string }> {
      static storeName = 'SomeStore'
      public state = { state: '' }
    }

    const mockSomeStore = (state: State) =>
      mockStore(SomeStore, { state: 'defaultMockState', ...state })

    const actual = mockStore(SomeStore, { state: 'mock' })
    expect(actual).toMatchSnapshot()
  })
})
