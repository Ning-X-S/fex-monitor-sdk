import { reportData } from '../../lib/network/report'
/**
* @todo 数据过滤、截断、采样、合并、加密、压缩
*/
let timer
export async function tracker (data) {
  if (timer) {
    clearTimeout(timer)
  }
  /**
   * @todo spa项目 别忘了销毁
   */
  timer = await setTimeout(async () => {
    const options = {
      url: 'https://m.lehe.com/api/jarvis/record/create',
      method: 'POST',
      body: JSON.stringify({ activityList: data })
    }
    await reportData(options)
  }, 3000)
}
