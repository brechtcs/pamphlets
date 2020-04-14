var pamphlets = []

class Pamphlet {
  static publish (content) {
    pamphlets.push(content)
  }

  static list () {
    return Array.from(pamphlets)
  }
}

module.exports = Pamphlet
