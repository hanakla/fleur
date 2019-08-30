import { StoreGetter } from './AppContext'
import { SelectorResults } from './selector'

type NonArgsWrappedSelector = (getStore: StoreGetter) => any

type Selector = (getStore: StoreGetter, ...args: any) => any
type WrappedSelector<T extends Selector> = T extends (
  getStore: StoreGetter,
  ...args: infer R
) => any
  ? (getStore: StoreGetter, ...args: R) => ReturnType<T>
  : never

type ComplexSelector<Results extends readonly any[]> = (
  deps: Results,
  ...args: any[]
) => any
type WrappedComplexSelector<
  T extends ComplexSelector<readonly any[]>
> = T extends (deps: any, ...args: infer R) => any
  ? (getStore: StoreGetter, ...args: R) => ReturnType<T>
  : never

interface StoreSelectorCreator {
  <T extends Selector>(selector: T): WrappedSelector<T>

  <
    T extends ComplexSelector<SelectorResults<readonly [D1]>>,
    D1 extends NonArgsWrappedSelector
  >(
    deps: [D1],
    selector: T,
  ): WrappedComplexSelector<T>

  <
    T extends ComplexSelector<SelectorResults<readonly [D1, D2]>>,
    D1 extends NonArgsWrappedSelector,
    D2 extends NonArgsWrappedSelector
  >(
    deps: [D1, D2],
    selector: T,
  ): WrappedComplexSelector<T>

  <
    T extends ComplexSelector<SelectorResults<readonly [D1, D2, D3]>>,
    D1 extends NonArgsWrappedSelector,
    D2 extends NonArgsWrappedSelector,
    D3 extends NonArgsWrappedSelector
  >(
    deps: [D1, D2, D3],
    selector: T,
  ): WrappedComplexSelector<T>

  <
    T extends ComplexSelector<SelectorResults<readonly [D1, D2, D3, D4]>>,
    D1 extends NonArgsWrappedSelector,
    D2 extends NonArgsWrappedSelector,
    D3 extends NonArgsWrappedSelector,
    D4 extends NonArgsWrappedSelector
  >(
    deps: [D1, D2, D3, D4],
    selector: T,
  ): WrappedComplexSelector<T>

  <
    T extends ComplexSelector<SelectorResults<readonly [D1, D2, D3, D4, D5]>>,
    D1 extends NonArgsWrappedSelector,
    D2 extends NonArgsWrappedSelector,
    D3 extends NonArgsWrappedSelector,
    D4 extends NonArgsWrappedSelector,
    D5 extends NonArgsWrappedSelector
  >(
    deps: [D1, D2, D3, D4, D5],
    selector: T,
  ): WrappedComplexSelector<T>

  <
    T extends ComplexSelector<
      SelectorResults<readonly [D1, D2, D3, D4, D5, D6]>
    >,
    D1 extends NonArgsWrappedSelector,
    D2 extends NonArgsWrappedSelector,
    D3 extends NonArgsWrappedSelector,
    D4 extends NonArgsWrappedSelector,
    D5 extends NonArgsWrappedSelector,
    D6 extends NonArgsWrappedSelector
  >(
    deps: [D1, D2, D3, D4, D5, D6],
    selector: T,
  ): WrappedComplexSelector<T>

  <
    T extends ComplexSelector<SelectorResults<D>>,
    D extends readonly NonArgsWrappedSelector[]
  >(
    deps: D,
    selector: T,
  ): WrappedComplexSelector<T>
}

/**
 * Create selector with Store instance. it's not recommended to usually.
 * Pleast use `selector()` first.
 */
export const selectorWithStore: StoreSelectorCreator = (
  deps: Selector | WrappedSelector<any>[],
  selector?: ComplexSelector<any[]>,
) => {
  if (Array.isArray(deps) && !!selector) {
    return (getStore: StoreGetter, ...args: any) => {
      const results = deps.map(selector => selector(getStore))
      return selector(results, ...args)
    }
  }

  return deps as WrappedSelector<any>
}
