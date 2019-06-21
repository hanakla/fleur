import { Fleur } from './Fleur'
import { Store } from './Store'

describe('AppContext', () => {
  describe('dehydrate', () => {
    it('Should dehydrate', () => {
      class SomeStore extends Store {
        public state = { some: 1 }
      }
      class Some2Store extends Store {
        public state = { some2: 2 }
      }

      const app = new Fleur({
        stores: {
          some: SomeStore,
          some2: Some2Store,
        },
      })

      const ctx = app.createContext()

      ctx.getStore(SomeStore)
      ctx.getStore(Some2Store)

      expect(ctx.dehydrate()).toEqual({
        stores: {
          some: { some: 1 },
          some2: { some2: 2 },
        },
      })
    })
  })

  describe('rehydrate', () => {
    it('Should dehydrate', () => {
      class SomeStore extends Store {
        public state = { some: 1 }
      }
      class Some2Store extends Store {
        public state = { some2: 2 }
      }

      const app = new Fleur({
        stores: {
          some: SomeStore,
          some2: Some2Store,
        },
      })

      const ctx = app.createContext()
      ctx.rehydrate({
        stores: {
          some: { some: 1 },
          some2: { some2: 2 },
        },
      })

      expect(ctx.getStore(SomeStore).state).toEqual({ some: 1 })
      expect(ctx.getStore(Some2Store).state).toEqual({ some2: 2 })
    })
  })

  describe('getStore', () => {
    class SomeStore extends Store {
      public state = { some: 1 }
    }

    const app = new Fleur({ stores: { some: SomeStore } })

    it('Should get Store instance from StoreClass', () => {
      const context = app.createContext()
      expect(context.getStore(SomeStore)).toBeInstanceOf(SomeStore)
    })

    it('Should get Store instance from store name', () => {
      const context = app.createContext()
      expect(context.getStore('some')).toBeInstanceOf(SomeStore)
    })
  })
})
