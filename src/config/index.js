if (process.env.NODE_ENV === 'development') {
  module.exports = {
    REPORT_URL: 'http://127.0.0.1:7043/record/create'
  }
} else {
  module.exports = {
    REPORT_URL: 'https://m.lehe.com/api/jarvis/record/create'
  }
}
