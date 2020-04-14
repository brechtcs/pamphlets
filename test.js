var nodemailer = require('nodemailer')
var run = require('stdrun')

var transport = nodemailer.createTransport({
  host: '127.0.0.1',
  port: 2525,
  secure: false,
  ignoreTLS: true
})

async function send (opts = {}) {
  var from = opts.from || 'some@example.com'
  var to = 'publish@pamphlets.com'
  var subject = 'Literally anything'
  var text = ''

  for await (var chunk of process.stdin) {
    text += chunk
  }

  transport.sendMail({ from, to, subject, text })
}

run(send)
