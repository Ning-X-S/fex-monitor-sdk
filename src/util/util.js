export default {
  // 设置localStorage
  setStore: function (name, content) {
    if (typeof content !== 'string') {
      content = JSON.stringify(content)
    }
    window.localStorage.setItem(name, content)
  },

  // 获取localStorage
  getStore: function (name) {
    return window.localStorage.getItem(name)
  },

  // 删除localStorage
  removeStore: function (name) {
    window.localStorage.removeItem(name)
  },

  // 生成uuid
  uuid4e: function () {
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
      // tslint:disable-next-line:no-bitwise
      const r = (Math.random() * 16) | 0
      // tslint:disable-next-line:no-bitwise
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  },

  // 获取浏览器信息
  getBrowserInfo () {
    const agent = navigator.userAgent.toLowerCase()
    const regStr_ie = /msie [\d.]+;/gi
    const regStr_ff = /firefox\/[\d.]+/gi
    const regStr_chrome = /chrome\/[\d.]+/gi
    const regStr_saf = /safari\/[\d.]+/gi
    let browser = ''
    // IE
    if (agent.indexOf('msie') > 0) {
      browser = agent.match(regStr_ie)
      return {
        type: 'IE',
        version: (browser + '').replace(/[^0-9.]/ig, '')
      }
    }
    // firefox
    if (agent.indexOf('firefox') > 0) {
      browser = agent.match(regStr_ff)
      return {
        type: 'firefox',
        version: (browser + '').replace(/[^0-9.]/ig, '')
      }
    }
    // Chrome
    if (agent.indexOf('chrome') > 0) {
      browser = agent.match(regStr_chrome)
      return {
        type: 'chrome',
        version: (browser + '').replace(/[^0-9.]/ig, '')
      }
    }
    // Safari
    if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
      browser = agent.match(regStr_saf)
      return {
        type: 'safari',
        version: (browser + '').replace(/[^0-9.]/ig, '')
      }
    }

    // H5内嵌webview
    return 'WebView ' + agent
  },

  // 获取uid
  getUid () {
    if (this.getStore('jarvisUid')) {
      return this.getStore('jarvisUid')
    } else {
      const uid = this.uuid4e()
      this.setStore('jarvisUid', uid)
      return uid
    }
  },

  // 获取url中"?"符后的字串
  urlParams () {
    const url = location.search
    const params = {}
    if (url.indexOf('?') !== -1) {
      const str = url.substr(1)
      const strs = str.split('&')
      for (let i = 0; i < strs.length; i++) {
        params[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
      }
    }
    return params
  }
}
