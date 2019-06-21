// prettier-ignore
type ExtraArgs<T extends Selector> = T extends ((_: any, ...args: infer T) => any) ? T : never

export type Selector = (state: any, ...args: any[]) => any

export default <T extends Selector>(select: T) => (
  state: any,
  ...args: ExtraArgs<T>
) => select(state, ...args)
