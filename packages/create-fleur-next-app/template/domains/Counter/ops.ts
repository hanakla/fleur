import { operations } from '@fleur/fleur'
import { CounterActions } from './actions'

export const CounterOps = operations({
  increment(context) {
    context.dispatch(CounterActions.increment, { amount: 1 })
  },
  async asyncIncrement(context, amount: number) {
    await new Promise(resolve => {
      setTimeout(resolve, 1000)
    })

    context.dispatch(CounterActions.increment, { amount })
  },
})
