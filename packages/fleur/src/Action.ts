export type ActionIdentifier<P> = (() => P) & { __actionIdentifier: never }
export type ExtractPayloadType<T extends ActionIdentifier<any>> = ReturnType<T>
export type ActionsOf<
  T extends { [action: string]: ActionIdentifier<any> }
> = T[keyof T]

type ActionMap = { [key: string]: ActionIdentifier<any> | ActionMap }

export const action = <P>(name?: string): ActionIdentifier<P> => {
  const identifier = ((): P => {
    throw new Error('Do not call ActionIdentifier as function')
  }) as ActionIdentifier<P>

  if (name) {
    Object.defineProperty(identifier, 'name', { value: name })
  }

  return identifier
}

action.async = <Started = unknown, Done = unknown, Failed = unknown>(
  name: string = '',
) => ({
  started: action<Started>(name + '.started'),
  done: action<Done>(name + '.done'),
  failed: action<Failed>(name + '.failed'),
})

export function actions<T extends ActionMap>(
  namePrefix: string,
  actionMap: T,
  separator: string = '/',
): T {
  Object.keys(actionMap).forEach(key => {
    if (typeof actionMap[key] === 'function') {
      Object.defineProperty(actionMap[key], 'name', {
        value: `${namePrefix}${separator}${key}`,
      })
    } else {
      actions(
        `${namePrefix}${separator}${key}`,
        actionMap[key] as ActionMap,
        '.',
      )
    }
  })

  return actionMap
}
