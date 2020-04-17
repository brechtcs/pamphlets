var { Author } = require('../models/author')
var { join } = require('path')
var Mold = require('express-mold')
var VError = require('verror')
var express = require('express')

module.exports.serve = function () {
  var mold = new Mold()
  var server = express()

  server.set('views', join(__dirname, '../views'))
  server.set('view engine', 'html')
  server.engine('html', mold.engine(server, 'html'))

  server.get('/', function (req, res) {
    var authors = Author.list()
    var pamphlets = authors.map(a => a.pamphlets.slice(-1)).flat()
    res.render('home', { pamphlets })
  })

  server.get('/:handle', function (req, res) {
    var { handle } = req.params
    var author = Author.get(handle)
    res.render('author', { author })
  })

  server.use(function (err, req, res, next) {
    console.error(VError.fullStack(err))
    next()
  })

  return new Promise(function (resolve, reject) {
    server.listen(8080, function (err) {
      if (err) return reject(err)
      resolve(this.address())
    })
  })
}
