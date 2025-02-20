import { defineAsyncComponent } from 'vue'

export function defineAsyncCP(fn: () => any) {
  // do nothing
  // return defineAsyncComponent({
  //   loader: fn
  // })
  return fn()
}
