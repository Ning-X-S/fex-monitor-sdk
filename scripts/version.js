const { version } = require('../package.json')
const fs = require('fs')
const path = require('path')

function getNewVersion (param) {
  const queue = ['--major', '--minor', '--patch']
  const versionArray = version.split('.')

  const changeIndex = queue.indexOf(param)

  return versionArray.map((v, index) => {
    if (index > changeIndex) {
      return 0
    } else if (index === changeIndex) {
      return Number(v) + 1
    } else {
      return v
    }
  }).join('.')
}
function setConfigNewVersion (version) {
  return fs.writeFileSync(path.resolve(__dirname, '../src/config/version.json'), JSON.stringify({ version }, null, 2), 'utf8')
}
module.exports = {
  getNewVersion,
  setConfigNewVersion
}
