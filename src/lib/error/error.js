
import { getLines, substrRes } from '../../util'

const resourceError = {
  img: 'Img resource error.',
  script: 'Script resource error.',
  link: 'Style resource error.',
  audio: 'Audio resource error.',
  video: 'Video resource error.'
}

export function handleError (that) {
  window.addEventListener('error', e => {
    let errorData = {}
    const kind = 'error'
    let type = ''
    if (e.__proto__ === Event.prototype) {
      const target = e.target
      type = resourceError[target.localName]
      // 忽略img标签src为空的错误
      if (target.localName === 'img' && target.src === window.location.href) {
        return false
      }
      errorData = {
        filename: substrRes(target.src || target.href),
        // 资源404和500等具体错误需要服务端查日志
        message: substrRes((target.src || target.href || 'null') + '. ' + type)
      }
    } else if (e.__proto__ === ErrorEvent.prototype) {
      type = 'script'
      errorData = {
        line: e.lineno,
        col: e.colno,
        filename: e.filename,
        stack: getLines(e.error.stack),
        message: e.message.replace(/-|>|\|/g, '').split('\n').map(item => item.trim()).join('.\n')
      }
    } else {
      type = 'other'
      errorData.message = 'other error'
    }
    that.activityListPush(kind, type, errorData)
  }, true)
}
