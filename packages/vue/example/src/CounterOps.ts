import { operations } from '@fleur/fleur'
import { CounterActions } from './CounterActions'

export const CounterOps = operations({
  increase({ dispatch }) {
    dispatch(CounterActions.increase, {})
  },
})
