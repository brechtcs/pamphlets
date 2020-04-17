module.exports = function (server, port) {
  return new Promise(function (resolve, reject) {
    server.listen(port, function (err) {
      if (err) return reject(err)
      resolve(this.address())
    })
  })
}
