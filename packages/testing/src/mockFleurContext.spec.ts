import Fleur, { reducerStore } from '@fleur/fleur'
import { mockFleurContext } from './mockFleurContext'
import { mockStore } from './mockStore'

describe('mockFleurContext', () => {
  const Store = reducerStore('store', () => ({ b: '' }))
  const Store2 = reducerStore('store2', () => ({}))

  describe('with FleurApp', () => {
    const app = new Fleur({ stores: [Store, Store2] })

    it('Should create mocks by App config', () => {
      const mock = mockFleurContext(app)

      expect(mock.mockStores[0].StoreClass).toBe(Store)
      expect(mock.mockStores[1].StoreClass).toBe(Store2)
    })
  })

  describe('with Option', () => {
    it('Should create mocks by options', () => {
      const mock = mockFleurContext({
        stores: [mockStore(Store), mockStore(Store2)],
      })
    })
  })
})
