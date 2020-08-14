export function supportPerformance () {
  return window.performance || false
}
export function supportPerformanceEntry () {
  return !!(window.performance && window.performance.getEntries && window.performance.getEntriesByType('navigation')[0] && isSupportPerformanceObserver)
}

export function supportPerformanceClearResource () {
  return !!(window.performance && window.performance.clearResourceTimings)
}

export const isSupportPerformanceObserver = 'PerformanceObserver' in window && typeof PerformanceObserver === 'function'
