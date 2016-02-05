var PouchDB = require('pouchdb')
var path = require('path')

const development = process.env['NODE_ENV'] === 'development'

let settings

try {
  settings = JSON.parse(
    fs.readFileSync(
      path.join(storage.userConfig(), 'settings.json')
    )
  )
} catch (e) {
  console.log("settings reducer could not load settings.json:", e, "Falling back to default initialState.")
  settings = {
    localDatabase: 'STP',
    remoteDatabase: null,
    videoFilePath: null,
    instructors: ["Please Edit","Your Instructor List", "In Settings"]
  }
}

var database = development ?
  new PouchDB('test', {db: require('memdown')}) :
  new PouchDB(settings.localDatabase, {adapter: 'idb'})

if(!development && settings.remoteDatabase) {
  const sync = PouchDB.sync(settings.localDatabase, settings.remoteDatabase, {
    live: true,
    retry: true
  })
}

module.exports = database
