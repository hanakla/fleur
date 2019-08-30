import { Store } from './Store'
import { selectorWithStore } from './selectorWithStore'
import { Fleur } from './Fleur'
import { selector } from './selector'

describe('selector', () => {
  interface State {
    fetch: boolean
    users: { name: string; premium: boolean }[]
  }

  class TestStore extends Store<State> {
    static storeName = 'TestStore'

    public state = {
      fetch: false,
      users: [
        { name: 'Julianne Stingray', premium: true },
        { name: 'Dana Zane', premium: false },
      ],
    }

    getUsers() {
      return this.state.users
    }
  }

  const selectFetchStatus = selectorWithStore(
    getStore => getStore(TestStore).state.fetch,
  )
  const selectUsers = selectorWithStore(getStore =>
    getStore(TestStore).getUsers(),
  )
  const selectPremiumUsers = selectorWithStore(
    [selectUsers] as const,
    ([users], isPremium: boolean) => {
      return users.filter(user => user.premium === isPremium)
    },
  )

  const selectPremiumUsersWithStateSelector = selectorWithStore(
    [selector(getState => getState(TestStore).users)] as const,
    ([users], isPremium: boolean) =>
      users.filter(user => user.premium === isPremium),
  )

  const app = new Fleur({ stores: [TestStore] })

  it('Should (simple) select state correctly', () => {
    const context = app.createContext()
    const actual = selectFetchStatus(context.getStore.bind(context))
    expect(actual).toBe(false)
  })

  it('Should receive arguments', () => {
    const context = app.createContext()
    const actual1 = selectPremiumUsers(context.getStore.bind(context), true)
    expect(actual1).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "Julianne Stingray",
          "premium": true,
        },
      ]
    `)

    const actual2 = selectPremiumUsers(context.getStore.bind(context), false)
    expect(actual2).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "Dana Zane",
          "premium": false,
        },
      ]
    `)
  })

  it('Should works with state selector', () => {
    const context = app.createContext()
    const actual = selectPremiumUsersWithStateSelector(
      context.getStore.bind(context),
      false,
    )
    expect(actual).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "Dana Zane",
          "premium": false,
        },
      ]
    `)
  })

  it('Should type error passed extra arguments having selector', () => {
    const selectWithArg = selectorWithStore((getStore, extra: string) => null)
    selectorWithStore([selectWithArg], () => null)
  })
})
