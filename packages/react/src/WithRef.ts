import * as React from 'react'

export type WithRef<P> = P & { ref?: React.RefObject<any> }
