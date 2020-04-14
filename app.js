var { run, text } = require('stdrun')
var http = require('./servers/http')
var smtp = require('./servers/smtp')

async function* pamphlets () {
  var mail = await smtp.serve()
  yield text`Mail server started on ${mail.address}:${mail.port}`

  var web = await http.serve()
  yield text`Web server started on ${web.address}:${web.port}`
}

run(pamphlets)
