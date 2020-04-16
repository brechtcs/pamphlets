var Author = require('./author')
var Opt = require('stdopt/base')
var VError = require('verror')
var hash = require('stdopt/hash')
var string = require('stdopt/string')

var pamphlets = []
var struct = {
  content: string,
  author: Author
}

class Pamphlet extends Opt {
  static parse (p) {
    return hash(p, struct).use(function (err, pamphlet) {
      if (err) return new VError(err, 'Invalid pamphlet')
      return pamphlet
    })
  }

  static publish (p) {
    pamphlets.push(new Pamphlet(p).use())
  }

  static list () {
    return Array.from(pamphlets)
  }

  get author () {
    return this.use(function (err, p) {
      if (err) throw new VError(err, 'Cannot get author')
      return p.author
    })
  }

  get content () {
    return this.use(function (err, p) {
      if (err) throw new VError(err, 'Cannot get content')
      return p.content
    })
  }
}

module.exports = Opt.construct(Pamphlet)
