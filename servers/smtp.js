var { SMTPServer } = require('smtp-server')
var { simpleParser } = require('mailparser')
var Pamphlet = require('../models/pamphlet')

module.exports.serve = function () {
  var server = new SMTPServer({
    authOptional: true,

    async onData(stream, session, done) {
      var data = await simpleParser(stream)
      Pamphlet.publish(data.html || data.textAsHtml)
      done()
    }
  })

  return new Promise(function (resolve, reject) {
    server.listen(2525, function (err) {
      if (err) return reject(err)
      resolve(this.address())
    })
  })
}
