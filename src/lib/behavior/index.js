/**
 *
 * @desc 记录用户行为的内容，比如输入的内容
 */
export function recordBehavior (jarvis) {
  const mouseEventList = ['ontouchstart' in document.documentElement ? 'touchstart' : 'click']
  const keyboardEventList = ['keydown']
  const lastEvent = {
    path: '',
    type: '',
    times: 0,
    keyCodeList: []
  }
  mouseEventList.forEach(eventType => {
    document.addEventListener(eventType, event => {
      const lastActivity = jarvis.activityList.length > 0 ? jarvis.activityList[jarvis.activityList.length - 1] : {}
      const path = getSelectors(event.path)
      const type = event.type
      if (
        lastActivity._kind === 'behavior' &&
        lastActivity._type === 'mouse' &&
        lastActivity.path === path &&
        lastActivity.type === type
      ) {
        jarvis.activityList.pop()
      } else {
        lastEvent.path = path
        lastEvent.type = type
        lastEvent.times = 0
      }
      lastEvent.times++
      jarvis.activityListPush('behavior', 'mouse', {
        path,
        type,
        times: lastEvent.times,
        offsetX: event.offsetX || -1,
        offsetY: event.offsetY || -1,
        clientX: event.clientX || -1,
        clientY: event.clientY || -1,
        pageX: event.pageX || -1,
        pageY: event.pageY || -1,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight
      })
    }, {
      capture: true,
      passive: true
    })
  })
  keyboardEventList.forEach(eventType => {
    document.addEventListener(eventType, event => {
      const lastActivity = jarvis.activityList.length > 0 ? jarvis.activityList[jarvis.activityList.length - 1] : {}
      const path = getSelectors(event.path)
      const type = event.type
      if (
        lastActivity._kind === 'behavior' &&
        lastActivity._type === 'keyboard' &&
        lastActivity.path === path &&
        lastActivity.type === type
      ) {
        jarvis.activityList.pop()
      } else {
        lastEvent.path = path
        lastEvent.type = type
        lastEvent.keyCodeList = []
      }
      lastEvent.keyCodeList.push(event.keyCode)
      jarvis.activityListPush('behavior', 'keyboard', {
        path,
        type,
        keyCodeList: lastEvent.keyCodeList
      })
    }, {
      capture: true,
      passive: true
    })
  })
}

function getSelector (path) {
  return path.reverse().filter(element => {
    return element !== document && element !== window
  }).map(element => {
    let selector = ''
    if (element.id) {
      return `${element.nodeName.toLowerCase()}#${element.id}${getAttributes(element)}`
    } else if (element.className && typeof element.className === 'string') {
      return `${element.nodeName.toLowerCase()}.${element.className}${getAttributes(element)}`
    } else {
      selector = element.nodeName.toLowerCase()
    }
    return selector
  }).join(' ')
}
function getAttributes (element) {
  const arr = [...element.attributes]
  if (arr.length > 0) {
    return arr.reduce((a, c) => {
      if (c.name !== 'id' && c.name !== 'class' && c.name !== 'style') {
        return a + `[${c.name}${c.value ? '=' + c.value : ''}]`
      }
      return a
    }, '')
  }
  return ''
}
function getSelectors (pathOrTarget) {
  if (Array.isArray(pathOrTarget)) {
    return getSelector(pathOrTarget)
  } else {
    const path = []
    while (pathOrTarget) {
      path.push(pathOrTarget)
      pathOrTarget = pathOrTarget.parentNode
    }
    return getSelector(path)
  }
}
