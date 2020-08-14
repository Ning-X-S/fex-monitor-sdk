import { supportPerformanceEntry, supportPerformanceClearResource } from '../../util/caniuse'

export function getAllResourceTiming () {
  let resourceTimingList = []
  if (supportPerformanceEntry) {
    resourceTimingList = performance.getEntriesByType('resource')
      .map(source => ({ ...getResourceTiming(source) }))
  }
  return resourceTimingList
}

export function clearResourceTimings () {
  if (supportPerformanceClearResource) {
    performance.clearResourceTimings()
  }
}

// 不判断兼容性了
export function getResourceTiming ({
  name,
  nextHopProtocol,
  type,
  duration,
  redirectEnd,
  redirectStart,
  domainLookupStart,
  domainLookupEnd,
  fetchStart,
  connectEnd,
  connectStart,
  secureConnectionStart,
  responseStart,
  requestStart,
  responseEnd
}) {
  return {
    name,
    nextHopProtocol,
    type,
    // 总耗时
    durationTime: duration,
    // 重定向耗时
    redirectTime: redirectEnd - redirectStart,
    // 读取缓存的时间
    appCacheTime: domainLookupStart - fetchStart,
    // DNS 解析耗时
    DNSTime: domainLookupEnd - domainLookupStart,
    // TCP 链接耗时：
    TCPTime: connectEnd - connectStart,
    // SSL 安全连接耗时 secureConnectionStart为0时没有SSLTime
    SSLTime: secureConnectionStart === 0 ? secureConnectionStart : connectEnd - secureConnectionStart,
    // 网络请求耗时 Time to First Byte(TTFB)
    requestTime: responseStart - requestStart,
    // 数据传输耗时
    responseTime: responseEnd - responseStart
  }
}
