export type ActionIdentifier<P> = (() => P) & { __actionIdentifier: never }
export type ExtractPayloadType<T extends ActionIdentifier<any>> = ReturnType<T>
export type ActionsOf<
  T extends { [action: string]: ActionIdentifier<any> }
> = T[keyof T]

export const action = <P>(name?: string): ActionIdentifier<P> => {
  const identifier = ((): P => {
    throw new Error('Do not call ActionIdentifier as function')
  }) as ActionIdentifier<P>

  if (name) {
    Object.defineProperty(identifier, 'name', { value: name })
  }

  return identifier
}

export function actions<T extends { [key: string]: ActionIdentifier<any> }>(
  namePrefix: string,
  actions: T,
): T {
  Object.keys(actions).forEach(key => {
    Object.defineProperty(actions[key], 'name', {
      value: `${namePrefix}/${key}`,
    })
  })

  return actions
}
