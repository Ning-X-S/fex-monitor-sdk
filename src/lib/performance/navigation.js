import { supportPerformanceEntry } from '../../util/caniuse'
import { getResourceTiming } from './resource'
// 可以用 tti-polyfill 来计算tti，但是有点大4k，其实粗略估计一下就行 domContentLoadedEventEnd - navigationStart
// 这个代码设计的还是有点问题，不应该在这里面判断兼容性
const performance = window.performance

function performanceTiming () {
  return supportPerformanceEntry()
    ? performance.getEntriesByType('navigation')[0]
    : performance.timing
}

export function getNormalNavigationTiming () {
  const timing = performanceTiming()
  const {
    domInteractive,
    domContentLoadedEventEnd,
    loadEventStart,
    fetchStart,
    domainLookupStart,
    responseStart,
    responseEnd,
    transferSize,
    encodedBodySize,
    navigationStart
  } = timing
  const timingObj = {
    ...getResourceTiming(timing),
    // DOM 解析耗时
    DOMParseTime: domInteractive - responseEnd,
    // 资源加载耗时
    resourcesLoadTime: loadEventStart - domContentLoadedEventEnd,
    // 首包时间
    firstPackageTime: responseStart - domainLookupStart,
    // 白屏时间
    blankTime: responseStart - fetchStart,
    // 首屏时间
    firstInterTime: domInteractive - fetchStart,
    // domContentLoadedEventEnd时间
    DCLTime: domContentLoadedEventEnd - fetchStart,
    // 总耗时
    pageLoadTime: loadEventStart - fetchStart,
    // 页面可交互时间
    TTI: domContentLoadedEventEnd - navigationStart
  }
  if (supportPerformanceEntry()) {
    // http 头部大小
    timingObj.httpHeadSize = transferSize - encodedBodySize > 0 ? transferSize - encodedBodySize : 0
  }
  return timingObj
}
export function getAdvancedNavigationTiming () {
  return new Promise(resolve => {
    // 默认值都改成-1，为了区分真正的0
    const advancedData = {
      FMP: -1,
      LCP: -1,
      FP: -1,
      FCP: -1
    }
    if (supportPerformanceEntry()) {
      advancedData.FP = performance.getEntriesByName('first-paint')?.[0]?.startTime || -1
      advancedData.FCP = performance.getEntriesByName('first-contentful-paint')?.[0]?.startTime || -1
      // 增加一个性能条目的观察者
      const elementObserve = new PerformanceObserver((entryList, observer) => {
        const perfEntries = entryList.getEntries()
        advancedData.FMP = perfEntries?.[0]?.startTime
        observer.disconnect()
      })
      elementObserve.observe && elementObserve.observe({
        entryTypes: ['element']
      })

      const paintObserve = new PerformanceObserver((entryList, observer) => {
        const perfEntries = entryList.getEntries()
        advancedData.LCP = perfEntries?.[perfEntries.length - 1]?.startTime
        observer.disconnect()
      })
      paintObserve.observe && paintObserve.observe({
        entryTypes: ['largest-contentful-paint']
      })
    }
    resolve(advancedData)
  })
}
