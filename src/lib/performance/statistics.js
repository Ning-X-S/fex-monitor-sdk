import { supportPerformanceEntry } from '../../util/caniuse'

export function getStatistics () {
  const indicator = {
    JSResourceCount: -1,
    CSSResourceCount: -1,
    AJAXRequestCount: -1,
    IMGResourceCount: -1,
    LINKResourceCount: -1
  }
  if (supportPerformanceEntry()) {
    const p = window.performance.getEntries()
    indicator.JSResourceCount = p.filter(ele => ele.initiatorType === 'script').length
    indicator.CSSResourceCount = p.filter(ele => ele.initiatorType === 'css').length
    indicator.AJAXRequestCount = p.filter(ele => ele.initiatorType === 'xmlhttprequest').length
    indicator.IMGResourceCount = p.filter(ele => ele.initiatorType === 'img').length
    indicator.LINKResourceCount = p.filter(ele => ele.initiatorType === 'link').length
  }
  return indicator
}
