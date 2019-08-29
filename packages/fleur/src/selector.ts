import { StoreGetter } from './AppContext'

export type Selector = (getStore: StoreGetter, ...args: any[]) => any

/** Selector without any extra arguments */
type NonArgsSelector = (getStore: StoreGetter) => any

type ComplexSelector<Results extends readonly any[]> = (
  deps: Results,
  ...args: any[]
) => any

type WrapedComplexSelector<
  T extends ComplexSelector<readonly any[]>
> = T extends (deps: any, ...args: infer R) => any
  ? (getStore: StoreGetter, ...args: R) => any
  : never

interface SelectorCreator {
  <T extends Selector>(selector: T): T

  <
    T extends ComplexSelector<SelectorResults<readonly [D1]>>,
    D1 extends NonArgsSelector
  >(
    deps: [D1],
    selector: T,
  ): WrapedComplexSelector<T>

  <
    T extends ComplexSelector<SelectorResults<readonly [D1, D2]>>,
    D1 extends NonArgsSelector,
    D2 extends NonArgsSelector
  >(
    deps: [D1, D2],
    selector: T,
  ): WrapedComplexSelector<T>

  <
    T extends ComplexSelector<SelectorResults<readonly [D1, D2, D3]>>,
    D1 extends NonArgsSelector,
    D2 extends NonArgsSelector,
    D3 extends NonArgsSelector
  >(
    deps: [D1, D2, D3],
    selector: T,
  ): WrapedComplexSelector<T>

  <
    T extends ComplexSelector<SelectorResults<readonly [D1, D2, D3, D4]>>,
    D1 extends NonArgsSelector,
    D2 extends NonArgsSelector,
    D3 extends NonArgsSelector,
    D4 extends NonArgsSelector
  >(
    deps: [D1, D2, D3, D4],
    selector: T,
  ): WrapedComplexSelector<T>

  <
    T extends ComplexSelector<SelectorResults<readonly [D1, D2, D3, D4, D5]>>,
    D1 extends NonArgsSelector,
    D2 extends NonArgsSelector,
    D3 extends NonArgsSelector,
    D4 extends NonArgsSelector,
    D5 extends NonArgsSelector
  >(
    deps: [D1, D2, D3, D4, D5],
    selector: T,
  ): WrapedComplexSelector<T>

  <
    T extends ComplexSelector<
      SelectorResults<readonly [D1, D2, D3, D4, D5, D6]>
    >,
    D1 extends NonArgsSelector,
    D2 extends NonArgsSelector,
    D3 extends NonArgsSelector,
    D4 extends NonArgsSelector,
    D5 extends NonArgsSelector,
    D6 extends NonArgsSelector
  >(
    deps: [D1, D2, D3, D4, D5, D6],
    selector: T,
  ): WrapedComplexSelector<T>

  <
    T extends ComplexSelector<SelectorResults<D>>,
    D extends readonly NonArgsSelector[]
  >(
    deps: D,
    selector: T,
  ): WrapedComplexSelector<T>
}

type SelectorResults<T extends readonly Selector[]> = {
  [K in keyof T]: T[K] extends (...args: any) => infer R ? R : never
}

export const selector: SelectorCreator = (
  deps: Selector | Selector[],
  selector?: ComplexSelector<any[]>,
): Selector => {
  if (Array.isArray(deps) && !!selector) {
    return (getStore: StoreGetter, ...args: any[]) => {
      const results = deps.map(selector => selector(getStore))

      return (selector as ComplexSelector<SelectorResults<typeof deps>>)(
        results,
        ...args,
      )
    }
  }

  return deps as Selector
}
