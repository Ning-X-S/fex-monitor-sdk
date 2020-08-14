import { getUrlParams, substrRes } from '../../util'
// 拦截fetch
export function interceptFetch (that) {
  const oldFectch = window.fetch

  window.fetch = function (url, options) {
    // console.log(getUrlParams(url))
    return new Promise((resolve, reject) => {
      oldFectch.apply(this, arguments).then((response) => {
        const oldJson = response.json
        response.json = function () {
          const result = oldJson.apply(this, arguments)
          result.then(res => {
            that.activityListPush('request', 'fetch', {
              response: substrRes(res),
              status: response.status,
              method: options.method,
              requestURL: url,
              params: options.method.toLocaleUpperCase() === 'GET' ? getUrlParams(url) : options.body
            })
          })
          return result
        }
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}
