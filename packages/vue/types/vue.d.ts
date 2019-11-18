import Vue from 'vue'
import { AppContext, ComponentContext, StoreClass } from '@fleur/fleur'

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    context?: AppContext
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $executeOperation: ComponentContext['executeOperation']
    $getStore: ComponentContext['getStore']
    $__fleurListenedStores: Set<StoreClass>
  }
}
