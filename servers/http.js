var { join } = require('path')
var Mold = require('express-mold')
var Pamphlet = require('../models/pamphlet')
var express = require('express')

module.exports.serve = function () {
  var mold = new Mold()
  var server = express()

  server.set('views', join(__dirname, '../views'))
  server.set('view engine', 'html')
  server.engine('html', mold.engine(server, 'html'))

  server.get('/', function (req, res) {
    res.render('home', { pamphlets: Pamphlet.list() })
  })

  return new Promise(function (resolve, reject) {
    server.listen(8080, function (err) {
      if (err) return reject(err)
      resolve(this.address())
    })
  })
}
