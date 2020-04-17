var { hash, list, number, string } = require('stdopt')
var Opt = require('stdopt/base')
var VError = require('verror')

/**
 * Authors model
 */
var authorMap = {}
var authorStruct = {
  email: string,
  handle: string,
  name: string,
  pamphlets: list.of(number)
}

class Author extends Opt {
  static parse (a) {
    return hash(a, authorStruct).use(function (err, author) {
      if (err) return VError(err, 'Invalid Author')
      return author
    })
  }

  static from (email) {
    var author = Object.values(authorMap).find(a => {
      return a.use(function (err, au) {
        if (err) return false
        return au.email === email
      })
    })

    return new Author(author)
  }

  static get (handle) {
    return new Author(authorMap[handle])
  }

  static list () {
    return Object.values(authorMap)
  }

  publish (id) {
    this.use(function publish (err, a) {
      if (err) throw new VError(err, 'Cannot publish Pamphlet')
      authorMap[a.handle] = new Author({
        ...a,
        pamphlets: a.pamphlets.concat([id])
      })
    })
  }

  get name () {
    return this.use(function name (err, a) {
      if (err) throw new VError(err, 'Cannot get name')
      return a.name
    })
  }

  get pamphlets () {
    return this.use(function pamphlets (err, a) {
      if (err) throw new VError(err, 'Cannot get pamphlets')
      return a.pamphlets.reduce((obj, id) => {
        obj[id] = Pamphlet.get(id)
        return obj
      }, {})
    })
  }

  get recent () {
    return this.use(function recent (err, a) {
      if (err) throw new VError(err, 'Cannot get most recent pamphlet')
      var id = a.pamphlets[a.pamphlets.length - 1]
      var pamphlet = Pamphlet.get(id)
      return pamphlet.isValid ? [pamphlet] : []
    })
  }
}

/**
 * Pamphlets model
 */
var pamphletList = []
var pamphletStruct = {
  id: string,
  content: string,
  author: string
}

class Pamphlet extends Opt {
  static parse (p) {
    return hash(p, pamphletStruct).use(function (err, pamphlet) {
      if (err) return new VError(err, 'Invalid pamphlet')
      return pamphlet
    })
  }

  static get (id) {
    return new Pamphlet(pamphletList[id])
  }

  static publish (p) {
    var id = pamphletList.length
    var pamphlet = new Pamphlet({ ...p, id })
    pamphletList.push(pamphlet.use())

    var author = Author.from(p.author)
    author.publish(id)
  }

  get author () {
    return this.use(function author (err, p) {
      if (err) throw new VError(err, 'Cannot get author')
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

module.exports.Author = Author
module.exports.Pamphlet = Pamphlet

// Hardcode test authors:
authorMap['some'] = new Author({
  email: 'some@example.com',
  handle: 'some',
  name: 'Some Author',
  pamphlets: []
})

authorMap['other'] = new Author({
  email: 'other@example.com',
  handle: 'other',
  name: 'Other Author',
  pamphlets: []
})
