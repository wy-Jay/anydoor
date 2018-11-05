const fs = require ('fs')
const path = require ('path')
const promisify = require('util').promisify
const stat = promisify (fs.stat)
const readdir = promisify (fs.readdir)
const Handlebars = require ('handlebars')
const mime = require ('../helper/mime')

const compress = require ('../config/compress')
const range = require ('../config/range')


const tplPath = path.join(__dirname, '../template/dir.tpl')
const source = fs.readFileSync (tplPath)
const tempalte = Handlebars.compile (source.toString())
module.exports = async function ( req, res,filePath , config) {
  try {
    const stats = await stat (filePath);
    if (stats.isFile () ) {
      res.statusCode = 200;
      res.setHeader ('Content-Type', mime(filePath))
      let rs;
      const {code, start, end} = range (stats.size, req, res)
      if (code == 200) {
        rs = fs.createReadStream (filePath)
      }else {
        rs = fs.createReadStream (filePath, {start, end})
      }
      if (filePath.match (config.compress)) {
        rs = compress (rs, req, res)
      }
      rs.pipe (res)
    }else if (stats.isDirectory () ){
      const files = await readdir (filePath)
      res.statusCode = 200;
      res.setHeader ('Content-Type', 'text/html')
      const dir = path.relative(config.root, filePath) 
      const data = {
        title: path.basename (filePath),
        dir: dir ? `/${dir}` : '',
        files: files.map (file => {
          return {
            file,
            icon: mime (file)
          }
        })
      }

      res.end (tempalte (data))
    }
  } catch (e) {
    res.statusCode = 404;
    res.setHeader ('Content-Type', 'text/plain')
    res.end ('error')
  }
}