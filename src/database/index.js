var PouchDB = require('pouchdb')
var path = require('path')

const test = process.env['NODE_ENV'] === 'test'

const initialSettings = {
  localDatabase: 'STP',
  remoteDatabase: null,
  videoFilePath: null,
  instructors: ["Please Edit","Your Instructor List", "In Settings"]
}

let settings

if ( test ) { settings = initialSettings }
else {
  try {
    settings = JSON.parse(
      fs.readFileSync(
        path.join(storage.userConfig(), 'settings.json')
      )
    )
  } catch (e) {
    console.log("settings reducer could not load settings.json:", "Falling back to default initialState.")
    settings = initialSettings
  }
}

var database = test ?
  new PouchDB('test', {db: require('memdown')}) :
  new PouchDB(settings.localDatabase, {adapter: 'idb'})

if(!test && settings.remoteDatabase) {
  const sync = PouchDB.sync(settings.localDatabase, settings.remoteDatabase, {
    live: true,
    retry: true
  })
}

database.compact()
  .then(res => console.log("Compacting database", res))
  .catch(err => console.log(err))

module.exports = database
