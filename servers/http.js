var { Author } = require('../models/core')
var { join } = require('path')
var Mold = require('express-mold')
var VError = require('verror')
var express = require('express')
var listen = require('./listen')

module.exports.serve = function () {
  var mold = new Mold()
  var server = express()

  server.set('views', join(__dirname, '../views'))
  server.set('view engine', 'html')
  server.engine('html', mold.engine(server, 'html'))

  server.get('/', function (req, res) {
    var authors = Author.list()
    var pamphlets = authors.map(a => a.recent).flat()
    res.render('home', { pamphlets })
  })

  server.get('/:handle', function (req, res) {
    var author = Author.get(req.params.handle)
    res.render('author', { author })
  })

  server.get('/:handle/:pamphlet', function (req, res) {
    var author = Author.get(req.params.handle)
    var pamphlet = author.pamphlets[req.params.pamphlet]
    res.render('pamphlet', { author, pamphlet })
  })

  server.use(function (err, req, res, next) {
    console.error(VError.fullStack(err))
    next()
  })

  return listen(server, 8080)
}
