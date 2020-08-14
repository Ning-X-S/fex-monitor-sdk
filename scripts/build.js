const webpack = require('webpack')
const configVersion = require('../config/webpack.build.version')
const { getNewVersion, setConfigNewVersion } = require('./version')

const arg = process.argv.slice(2)[0]
const newVersion = getNewVersion(arg)
setConfigNewVersion(newVersion)
configVersion.output.filename = 'jarvis-sdk.' + newVersion + '.min.js'

webpack(configVersion).run((err, stats) => { // Stats Object
  // ...
  console.log(err)
  console.log(stats)
})
