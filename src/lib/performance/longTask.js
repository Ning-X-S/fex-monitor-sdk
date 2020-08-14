import { supportPerformanceEntry } from '../../util/caniuse'

export function onLongTask (handler) {
  if (supportPerformanceEntry()) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        handler(entry)
      }
    })
    observer.observe({ entryTypes: ['longtask'] })
  }
}
