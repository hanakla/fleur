/// <reference path="../types/vue.d.ts" />

import { StoreGetter, StoreClass } from '@fleur/fleur'
import Vue, { PluginFunction } from 'vue'

export const refStore = (map: <T extends any>(store: StoreGetter) => T) =>
  function(this: Vue) {
    const getStore = <T extends StoreClass>(storeClass: T) => {
      const store = this.$getStore(storeClass)

      if (!this.$__fleurListenedStores.has(storeClass)) {
        this.$__fleurListenedStores.add(storeClass)
        store.on(() => {
          console.log('change')
          this.$forceUpdate()
        })
      }

      return store
    }

    return map(getStore)
  }

const install: PluginFunction<{}> = function(Vue) {
  const beforeCreate = function(this: Vue) {
    if (this.$options.context) {
      const { componentContext } = this.$options.context
      this.$executeOperation = componentContext.executeOperation
      this.$getStore = componentContext.getStore
      this.$__fleurListenedStores = new Set<any>()
    }
  }

  const beforeDestroy = function(this: Vue) {
    // this.$__fleurListenedStores.forEach(storeClass => {
    //   // this.$getStore(storeClass).off()
    // })
  }

  Vue.mixin({ beforeCreate, beforeDestroy })
}

export default { install }
