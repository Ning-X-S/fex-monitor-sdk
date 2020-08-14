
// 设置localStorage
export function setStore (name, content) {
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

// 获取localStorage
export function getStore (name) {
  return window.localStorage.getItem(name)
}

// 删除localStorage
export function removeStore (name) {
  window.localStorage.removeItem(name)
}

// 生成UUID
export function createUUID () {
  // http://stackoverflow.com/questions/105034/how-to-create-a-guid-UUID-in-javascript/2117523#2117523
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
    // tslint:disable-next-line:no-bitwise
    const r = (Math.random() * 16) | 0
    // tslint:disable-next-line:no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// 获取uid
export function getUUID () {
  if (getStore('jarvisUUID')) {
    return getStore('jarvisUUID')
  } else {
    const UUID = createUUID()
    setStore('jarvisUUID', UUID)
    return UUID
  }
}

export function getDateTime () {
  const currentTime = new Date()
  return `${currentTime.getFullYear()}-${String(currentTime.getMonth() + 1).padStart(2, '0')}-${String(currentTime.getDate()).padStart(2, '0')} ${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}:${String(currentTime.getSeconds()).padStart(2, '0')}.${String(currentTime.getMilliseconds()).padStart(3, '0')}`
}

export function getUrlParams (url = '') {
  const params = {}
  if (url.indexOf('?') !== -1) {
    console.log(url.split('?'))
    const str = url.split('?')[1]
    const strs = str.split('&')
    for (let i = 0; i < strs.length; i++) {
      params[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
    }
  }
  return params
}

export function getLines (stack) {
  return stack.split('\n').map(item => item.replace(/^\s+at\s+/g, ''))
}

// response 过大就截取前50字符加后50字符返回
export function substrRes (res) {
  if (typeof res === 'string') {
    if (res.length > 300) {
      return `${res.substr(0, 50)}$......$${res.substring(res.length - 50)}`
    } else {
      return res
    }
  } else if (typeof res === 'object') {
    if (res === null) return null
    return 'object'
  } else {
    return res
  }
}
