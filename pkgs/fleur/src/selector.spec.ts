import { reducerStore } from './Store'
import { selector } from './selector'
import { Fleur } from './Fleur'

describe('selector', () => {
  const TestStore = reducerStore('TestStore', () => ({
    fetch: false,
    users: [
      { name: 'Julianne Stingray', premium: true },
      { name: 'Dana Zane', premium: false },
    ],
  }))

  const selectFetchStatus = selector((getState) => getState(TestStore).fetch)
  const selectUsers = selector((getState) => getState(TestStore).users)
  const selectPremiumUsers = selector(
    [selectUsers] as const,
    ([users], isPremium: boolean) => {
      return users.filter((user) => user.premium === isPremium)
    },
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

  it('Should type error passed extra arguments having selector', () => {
    const selectWithArg = selector((getStore, extra: string) => null)
    selector([selectWithArg], () => null)
  })
})
