// import 'core-js/stable'
// import 'regenerator-runtime/runtime'
import { version } from './config/version.json'
import { getNavigationTiming, getAllResourceTiming, onLongTask, getStatistics } from './lib/performance'
import { createUUID, getUUID, getDateTime } from './util'
import { interceptFetch as initFetch } from './lib/network/fetch'
import { interceptXMLHttpRequest as initXHR } from './lib/network/xhr'
import { recordBehavior as initBehavior } from './lib/behavior'
import { handleError as initError } from './lib/error/error'
import { handleRejection as initRejection } from './lib/error/rejection'
import { onContentLoad, onLoad, onBeforeUnLoad, onUnLoad, onUrlChange, onVisibilitychange, onNetworkChange } from './lib/lifecycle'
import { interceptConsole as initConsole } from './lib/console'
import { reportData } from './lib/network/report'
import { REPORT_URL } from './config'

const isDev = process.env.NODE_ENV === 'development'
class Jarvis {
  version = version
  uuid = getUUID()
  sid = createUUID()
  activityList = []
  constructor ({
    name,
    beforeSend, // function 发送前
    denyUrls, // array[string] 不上报的url
    allowUrls, // array[string] 上报的url
    isDebounce, // boolean 是否防抖
    debounceTime // number 防抖的时间
  }) {
    this.pid = name || ''
    this.activityListPush('init', 'basic', {
      userAgent: window.navigator.userAgent,
      startTime: new Date().getTime()
    })
    // 注册生命周期
    onContentLoad(this.onContentLoad)
    onLoad(this.onLoad)
    onBeforeUnLoad(this.onBeforeUnLoad)
    onUnLoad(this.onUnLoad)
    onUrlChange(this.onAfterUrlChange, this.onBeforeUrlChange)
    // 页面状态
    onVisibilitychange(this.onVisibilityChange)
    onNetworkChange(this.onNetworkChange)
    // 初始化子模块
    initError(this)
    initRejection(this)
    initXHR(this)
    initFetch(this)
    if (!isDev) {
      onLongTask(this.onLongTask)
      initConsole(this)
    }
  }

  onContentLoad = e => {
    initBehavior(this)
    console.log('contentLoad', new Date().getTime())
  }

  onLoad = async e => {
    console.log('load')
    this.activityListPush('experience', 'resource', {
      resource: getAllResourceTiming()
    })
    this.activityListPush('experience', 'timing',
      await getNavigationTiming()
    )
  }

  onBeforeUnLoad = e => {
    console.log('beforeUnLoad')
  }

  onUnLoad = e => {
    console.log('unLoad')
    this.handlerEnd()
  }

  onAfterUrlChange = e => {
    this.sid = createUUID()
    // this.handlerEnd()
    // this.init()
  }

  onBeforeUrlChange = e => {
    /**
    * @todo 单页面上报信息
    */
    // this.handlerEnd()
    // clearResourceTimings()
  }

  handlerEnd=e => {
    // 提交队列里的所有数据
    this.activityListPush('end', 'basic', {
      endTime: new Date().getTime(),
      ...getStatistics()
    })
    this.dispatchReport(this.activityList, null, true)
  }

  onVisibilityChange = e => {
    this.activityListPush('behavior', 'visible')
  }

  onNetworkChange = e => {
    this.activityListPush('behavior', 'network')
  }

  onLongTask = e => {
    this.activityListPush('experience', 'longTask', {
      attribution: JSON.stringify(e.attribution),
      startTime: e.startTime,
      duration: e.duration
    })
  }

  dispatchReport (data, isNow, isUnLoad) {
    const temp = data// cloneDeep(data)
    if (this.timer) {
      clearTimeout(this.timer)
    }
    const options = {
      url: REPORT_URL,
      method: 'POST',
      body: JSON.stringify({ activityList: temp })
    }
    if (isUnLoad) {
      this.sendBeacon(options)
    } else if (isNow) {
      this.sendReport(options)
    } else {
      this.timer = setTimeout(() => {
        this.sendReport(options)
      }, 3000)
    }
  }

  sendReport (options) {
    reportData(options)
    this.activityListClear()
  }

  sendBeacon (options) {
    const rumData = new FormData()
    rumData.append('activityList', JSON.stringify(this.activityList))

    if (!('sendBeacon' in navigator && navigator.sendBeacon(options.url, rumData))) {
      this.sendReport(options)
    }
  }

  activityListPush = (...item) => {
    this.activityList.push(this.activityItem(...item))
    if (isDev) {
      console.log(this.activityList)
    } else {
      if (this.activityList.length > 30) {
        this.dispatchReport(this.activityList, true)
      } else {
        this.dispatchReport(this.activityList)
      }
    }
  }

  activityListClear = () => {
    this.activityList = []
  }

  activityItem = (kind, type, content) => {
    return {
      _version: this.version,
      _kind: kind,
      _type: type,
      // session id 会话id
      _sid: this.sid,
      // project id 项目id
      _pid: this.pid,
      // universally unique id
      _uuid: this.uuid,
      _visible: document.visibilityState || '',
      _onLine: navigator.onLine || '',
      _url: window.location.href,
      _dateTime: getDateTime(),
      ...content
    }
  }

  vueErrorHandler (vm) {
    vm.config.errorHandler = (err, vm, info) => {
      this.activityListPush('error', 'Vue', {
        message: err.message,
        stack: err.stack.replace(/-|>|\|/g, '').split('\n').map(item => item.trim()),
        filename: vm.$options ? vm.$options._componentTag + '.vue' : '',
        timeLine: info
      })
    }
  }
}
if (isDev) {
  window.jarvis = new Jarvis({ name: 'test' })
}
export default Jarvis
