type Receiver<Deps> = (deps: Deps) => (...args: any[]) => any
type ProxiedFuncOf<R extends Receiver<any>> = ReturnType<R>

interface Injector<Deps, R extends Receiver<Deps>> {
  (...args: Parameters<ProxiedFuncOf<R>>): ReturnType<ProxiedFuncOf<R>>
  inject(deps: Deps): { exec: ProxiedFuncOf<R> }
}

export const inject = <D extends object>(defaultImpls: D) => {
  return <R extends Receiver<D>>(receiver: R) => {
    const injector: Injector<D, R> = (...args: any) =>
      receiver(defaultImpls)(...args)
    injector.inject = (deps: D) => ({
      exec: receiver(deps) as ProxiedFuncOf<R>,
    })
    return injector
  }
}
