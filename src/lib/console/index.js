export function interceptConsole (that) {
  // 先选这几个方法
  ['log', 'error', 'info', 'warn'].forEach(key => {
    const originalFun = console[key]
    console[key] = function (...args) {
      args.forEach(arg => {
        that.activityListPush('console', key, {
          msg: stringify(arg)
        })
      })
      originalFun.call(this, ...args)
    }
  })
}
function stringify (arg) {
  if (typeof arg === 'object' && arg !== null) {
    const temp = {}
    for (const key in arg) {
      if (Object.prototype.hasOwnProperty.call(arg, key)) {
        temp[key] = convert(arg[key])
      }
    }
  } else {
    return arg
  }
}
function convert (value) {
  if (
    value !== undefined &&
    value !== null &&
    !value.toString
  ) {
    return ''
  } else if (
    typeof value !== 'number' &&
    typeof value !== 'boolean' &&
    typeof value !== 'string' &&
    value !== undefined &&
    value !== null
  ) {
    return value.toString()
  }
  return value
}
