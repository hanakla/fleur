import { reducerStore } from '@fleur/fleur'
import { CounterActions } from './actions'

interface State {
  count: number
}

export const CounterStore = reducerStore<State>('CounterStore', () => ({
  count: 0,
})).listen(
  CounterActions.increment,
  (draft, { amount }) => (draft.count += amount),
)
