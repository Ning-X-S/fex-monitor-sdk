const http = require('http')
const path = require('path')
const fs = require('fs')
const PORT = 8000

http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(404)
        res.write('404 - 文件未找到')
        res.end()
      } else {
        res.writeHead(200)
        res.write(data)
        res.end()
      }
    })
  } else if (req.url === '/lib/jarvis-sdk.min.js') {
    fs.readFile(path.join(__dirname, '..', 'lib', 'jarvis-sdk.min.js'), (err, data) => {
      if (err) {
        res.writeHead(404)
        res.write('404 - 文件未找到')
        res.end()
      } else {
        res.writeHead(200)
        res.write(data)
        res.end()
      }
    })
  } else {
    setTimeout(() => {
      res.writeHead(404)
      res.write('404 - 文件未找到')
      res.end()
    }, 2000 * Math.random())
  }
}).listen(PORT)

console.log(`Server is listening ${PORT}`)