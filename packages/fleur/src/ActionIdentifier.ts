export type ActionIdentifier<P> = (() => P) & { __actionIdentifier: never }
export type ExtractPayloadType<T extends ActionIdentifier<any>> = ReturnType<T>
export type ExtractActionIdentifiersFromObject<T extends object> = T[keyof T]

const action = <P>(name?: string): ActionIdentifier<P> => {
    const identifier = ((): P => {
        throw new Error('Do not call ActionIdentifier as function')
    }) as ActionIdentifier<P>

    if (name) {
        Object.defineProperty(identifier, 'name', { value: name })
    }

    return identifier
}

export { action }
