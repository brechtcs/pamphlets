var Pamphlet = require('../models/pamphlet')
var express = require('express')

module.exports.serve = function () {
  var server = express()

  server.get('/', function (req, res) {
    res.writeHead(200)
    res.end(`<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>pamphlets</title>
        </head>
        <body>
          <h1>Pamphlets</h1>
          ${Pamphlet.list().map(p => `<article>${p}</article>`).join('\n')}
        </body>
      </html>
    `)
  })

  return new Promise(function (resolve, reject) {
    server.listen(8080, function (err) {
      if (err) return reject(err)
      resolve(this.address())
    })
  })
}
