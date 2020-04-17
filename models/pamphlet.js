var Opt = require('stdopt/base')
var VError = require('verror')
var hash = require('stdopt/hash')
var string = require('stdopt/string')

var struct = {
  author: string,
  content: string
}

class Pamphlet extends Opt {
  static parse (p) {
    return hash(p, struct).use(function (err, pamphlet) {
      if (err) return new VError(err, 'Invalid pamphlet')
      return pamphlet
    })
  }

  static publish (p) {
    var { Author } = require('./author')
    var author = Author.from(p.author)
    author.publish(new Pamphlet(p))
  }

  get author () {
    return this.use(function author (err, p) {
      if (err) throw new VError(err, 'Cannot get author')
      var { Author } = require('./author')
      return Author.from(p.author)
    })
  }

  get content () {
    return this.use(function content (err, p) {
      if (err) throw new VError(err, 'Cannot get content')
      return p.content
    })
  }
}

module.exports.Pamphlet = Pamphlet
