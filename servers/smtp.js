var { Pamphlet } = require('../models/core')
var { SMTPServer } = require('smtp-server')
var { simpleParser } = require('mailparser')
var listen = require('./listen')

module.exports.serve = function () {
  var server = new SMTPServer({
    authOptional: true,

    async onData(stream, session, done) {
      try {
        var data = await simpleParser(stream)
        var pamphlet = {
          content: data.html || data.textAsHtml,
          author: data.from.text
        }

        Pamphlet.publish(pamphlet)
        done()
      } catch (err) {
        console.log(err)
        done(err)
      }
    }
  })

  return listen(server, 2525)
}
