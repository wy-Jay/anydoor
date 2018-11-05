var http = require ('http')
const path = require ('path')
var chalk = require ('chalk')
var config = require ('./config/defaultConfig')
const route = require ('./helper/route')
const openUrl = require ('./helper/openUrl')


class Server {
  constructor (conf) {
    this.conf = Object.assign ({}, config, conf)
  }
  start () {
    const {port, hostname, root} = this.conf
    var server = http.createServer ( (req, res) => {
      const filePath = path.join(root, req.url)
      route ( req, res, filePath, this.conf )
    } )
    
    server.listen ( port, hostname, () => {
      const addr = `http://${hostname}:${port}`
      console.info (`server started at ${chalk.green(addr)}`)
      openUrl (addr)
    } )
  }
}


module.exports = Server