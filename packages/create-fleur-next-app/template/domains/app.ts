import {
  actions,
  action,
  reducerStore,
  operations,
  selector,
} from '@fleur/fleur'

export const AppActions = actions('Counter', {
  increment: action<{ amount: number }>(),
  accessDateSettled: action<{ date: Date }>(),
})

export const AppOps = operations({
  increment(context) {
    context.dispatch(AppActions.increment, { amount: 1 })
  },
  async asyncIncrement(context, amount: number) {
    await new Promise(resolve => {
      setTimeout(resolve, 1000)
    })

    context.dispatch(AppActions.increment, { amount })
  },
  settleAccessDate(context) {
    context.dispatch(AppActions.accessDateSettled, { date: new Date() })
  },
})

interface State {
  count: number
  accessDate: Date | null
}

export const AppStore = reducerStore<State>('AppStore', () => ({
  count: 0,
  accessDate: null,
}))
  .listen(AppActions.increment, (draft, { amount }) => (draft.count += amount))
  .listen(
    AppActions.accessDateSettled,
    (draft, { date }) => (draft.accessDate = date),
  )

export const AppSelectors = {
  getCount: selector(getState => getState(AppStore).count),
  getAccessDate: selector(getState => getState(AppStore).accessDate),
}
