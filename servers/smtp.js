var { SMTPServer } = require('smtp-server')
var { simpleParser } = require('mailparser')
var Pamphlet = require('../models/pamphlet')

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
        done(err)
      }
    }
  })

  return new Promise(function (resolve, reject) {
    server.listen(2525, function (err) {
      if (err) return reject(err)
      resolve(this.address())
    })
  })
}
