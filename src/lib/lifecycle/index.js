export function onLoad (callback) {
  if (document.readyState === 'complete') {
    // 页面已完全加载
    callback()
  } else {
    window.addEventListener('load', (e) => {
      callback(e)
    })
  }
}
export function onContentLoad (callback) {
  document.addEventListener('DOMContentLoaded', callback)
}

export function onBeforeUnLoad (callback) {
  window.addEventListener('beforeunload', callback)
}

export function onUnLoad (callback) {
  window.addEventListener('unload', callback, false)
}

// function addList (callback, list) {
//   if (!callback || typeof callback !== 'function') {
//     console.error(new Error('回调函数应该是一个函数'))
//   }
//   list.push(callback)
// }
// function runCallback (list) {
//   list.forEach(callback => {
//     callback()
//   })
// }
// export const onPushState = (function onPushState () {
//   const afterPushStateList = []
//   const beforePushStateList = []
//   history.pushState = (f => function pushState () {
//     runCallback(beforePushStateList)
//     var ret = f.apply(this, arguments)
//     runCallback(afterPushStateList)
//     console.log('history.pushState', beforePushStateList, afterPushStateList)
//     return ret
//   })(history.pushState)
//   return function ({ afterChange, beforeChange }) {
//     if (!afterChange && !beforeChange) {
//       console.error(new Error('参数传递错误'))
//     }
//     afterChange && addList(afterChange, afterPushStateList)
//     beforeChange && addList(beforeChange, beforePushStateList)
//   }
// })()

// export const onReplaceState = (function onReplaceState (callback) {
//   const afterReplaceStateList = []
//   const beforeReplaceStateList = []
//   history.replaceState = (f => function replaceState () {
//     runCallback(beforeReplaceStateList)
//     var ret = f.apply(this, arguments)
//     runCallback(afterReplaceStateList)
//     console.log('history.replaceState', beforeReplaceStateList, afterReplaceStateList)
//     return ret
//   })(history.pushState)
//   return function ({ afterChange, beforeChange }) {
//     if (!afterChange && !beforeChange) {
//       console.error(new Error('参数传递错误'))
//     }
//     afterChange && addList(afterChange, afterReplaceStateList)
//     beforeChange && addList(beforeChange, beforeReplaceStateList)
//   }
// })()

// export const onPopstate = (function onPopstate () {
//   const popstateList = []
//   window.onpopstate = function (event) {
//     runCallback(popstateList)
//   }
//   return function (callback) {
//     addList(callback, popstateList)
//   }
// })()

export function onUrlChange (afterChange, beforeChange) {
  // onPushState({ afterChange, beforeChange })
  // onReplaceState({ afterChange, beforeChange })
  // onPopstate(afterChange)
  const interceptHistory = function (type) {
    const oldFunction = history[type]
    return function () {
      afterChange()
      beforeChange()
      const newFunction = oldFunction.apply(this, arguments)
      return newFunction
    }
  }
  history.pushState = interceptHistory('pushState')
  history.replaceState = interceptHistory('replaceState')

  window.addEventListener('popstate', function (event) {
    afterChange()
  })
}

export function onVisibilitychange (callback) {
  document.addEventListener('visibilitychange', callback)
}

export function onNetworkChange (callback) {
  window.addEventListener('offline', function (e) {
    callback(e, 'offline')
  })
  window.addEventListener('online', function (e) {
    callback(e, 'online')
  })
}
