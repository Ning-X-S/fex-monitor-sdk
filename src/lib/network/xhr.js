import { substrRes } from '../../util'

// 拦截XMLHttpRequest
export function interceptXMLHttpRequest (that) {
  window.XMLHttpRequest.prototype.oldOpen = window.XMLHttpRequest.prototype.open
  window.XMLHttpRequest.prototype.open = function () {
    const [method, url, asyncStatus] = arguments
    this.requestMethod = method
    this.requestURL = url
    this.requestAsyncStatus = asyncStatus
    return this.oldOpen.apply(this, arguments)
  }
  window.XMLHttpRequest.prototype.oldSend = window.XMLHttpRequest.prototype.send
  window.XMLHttpRequest.prototype.send = function () {
    const arg = arguments
    this.addEventListener('readystatechange', function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        // Windows7 IE 没有responseURL属性,其次responseURL为只读属性不能修改
        const isWhite = (this.responseURL && !this.responseURL.match(/\/record\/create/)) || (this.requestURL && !this.requestURL.match(/\/record\/create/))
        if (isWhite) {
          that.activityListPush('request', 'xhr', {
            response: substrRes(this.response),
            status: this.status,
            method: this.requestMethod,
            params: arg[0] || '',
            requestURL: this.responseURL || this.requestURL
          })
        }
      }
    }, false)
    return this.oldSend.apply(this, arguments)
  }
}
