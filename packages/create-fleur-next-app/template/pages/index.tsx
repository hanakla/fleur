import React, { useEffect } from 'react'
// import { NextPage, NextPageContext } from 'next'
// import { useRouter } from 'next/router'
import { useStore, useFleurContext } from '@fleur/fleur-react'
import { CounterStore } from '../domains/Counter/store'
import { CounterOps } from '../domains/Counter/ops'
import { NextPage } from 'next'

const Index: NextPage = ({}) => {
  const { executeOperation } = useFleurContext()

  const { count } = useStore([CounterStore], getStore => ({
    count: getStore(CounterStore).state.count,
  }))

  useEffect(() => {
    const intervalId = setInterval(() => {
      executeOperation(CounterOps.increment)
    }, 100)

    return () => clearInterval(intervalId)
  }, [])

  return <div>Count: {count}</div>
}

Index.getInitialProps = async ctx => {
  await (ctx as any).context.executeOperation(
    CounterOps.asyncIncrement,
    (Math.random() * 1000) | 0,
  )
  return {}
}

export default Index
