var { Pamphlet } = require('./pamphlet')
var { hash, list, string } = require('stdopt')
var Opt = require('stdopt/base')
var VError = require('verror')

var authors = {}
var struct = {
  email: string,
  handle: string,
  name: string,
  pamphlets: list.of(Pamphlet)
}

class Author extends Opt {
  static parse (a) {
    return hash(a, struct).use(function (err, author) {
      if (err) return VError(err, 'Invalid Author')
      return author
    })
  }

  static from (email) {
    var author = Object.values(authors).find(a => {
      return a.use(function (err, au) {
        if (err) return false
        return au.email === email
      })
    })

    return new Author(author)
  }

  static get (handle) {
    return new Author(authors[handle])
  }

  static list () {
    return Object.values(authors)
  }

  publish (pamphlet) {
    this.use(function publish (err, a) {
      if (err) throw new VError(err, 'Cannot publish Pamphlet')
      var author = { ...a }
      author.pamphlets = Array.from(a.pamphlets)
      author.pamphlets.push(pamphlet.use())
      authors[a.handle] = new Author(author)
    })
  }

  get name () {
    return this.use(function name (err, author) {
      if (err) throw new VError(err, 'Cannot get name')
      return author.name
    })
  }

  get pamphlets () {
    return this.use(function pamphlets (err, author) {
      if (err) throw new VError(err, 'Cannot get pamphlets')
      return author.pamphlets.map(p => new Pamphlet(p))
    })
  }
}

// Hardcode test author:
authors['some.author'] = new Author({
  email: 'some@example.com',
  handle: 'some.author',
  name: 'Some Author',
  pamphlets: []
})

module.exports.Author = Author
