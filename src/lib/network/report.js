// init----XMLHttpRequest
export function reportData (options) {
  const request = new XMLHttpRequest()
  return new Promise((resolve, reject) => {
    try {
      request.open(options.method, options.url, true)
      if (options.method.toLocaleUpperCase() === 'POST') {
        request.setRequestHeader('Content-Type', 'application/json')
      }
      request.send(options.method.toLocaleUpperCase() === 'POST' ? options.body : '')
      request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            try {
              const res = JSON.parse(request.response)
              resolve(res)
            } catch (e) {
              resolve(request.response)
            }
          } else {
            resolve(request.response)
          }
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}
