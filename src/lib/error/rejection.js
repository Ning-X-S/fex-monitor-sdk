import { getLines } from '../../util'

export function handleRejection (that) {
  window.addEventListener('unhandledrejection', event => {
    let message
    let filename
    let line = 0
    let column = 0
    let stack = null
    const reason = event.reason
    if (typeof reason === 'string') {
      message = reason
      stack = reason
    } else if (typeof reason === 'object') {
      if (reason.stack) {
        const linesResult = getLines(reason.stack)
        if (linesResult.length > 1) {
          const isFile = linesResult[1].match(/\(/)
          const fileInfo = isFile ? linesResult[1].slice(isFile.index + 1, linesResult[1].length - 1).split(':') : linesResult[1].split(':')
          filename = fileInfo[0] + ':' + fileInfo[1] + ':' + fileInfo[2]
          line = fileInfo[3]
          column = fileInfo[4]
          message = reason.message || reason.stack.replace(/\s/g, '').replace(/\n/g, ' ')
        } else {
          message = linesResult[0] || null
        }
        stack = linesResult
      }
    } else {
      message = reason
      stack = reason
    }
    // promise
    that.activityListPush('error', 'promise ' + event.type, {
      message,
      stack,
      filename,
      line,
      column
    }, true)
  })
}
