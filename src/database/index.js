const PouchDB = require('pouchdb')
const path = require('path')
// import studentDesignDoc from './_design/students'
import createDesignDocs from './_design'
// import createLogEntryOptions from './_design/create-log-entry-options'

const runningInTestMode = process.env['NODE_ENV'] === 'test'

const initialSettings = {
  localDatabase: 'STP',
  remoteDatabase: null,
  videoFilePath: null,
  instructors: ["Please Edit","Your Instructor List", "In Settings"]
}

let settings

if ( runningInTestMode ) { settings = initialSettings }
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

var database = runningInTestMode ?
  new PouchDB('test', {db: require('memdown')}) :
  new PouchDB(settings.localDatabase, {adapter: 'idb'})

if(!runningInTestMode && settings.remoteDatabase) {
  const sync = PouchDB.sync(settings.localDatabase, settings.remoteDatabase, {
    live: true,
    retry: true
  })
}

// test whether _design docs exist, and create them if not

database.get('_design/students')
  .then((doc) => {
    // do nothing, because we don't need to if it already exists.
    // to update it, delete the app cache directory.
  })
  .catch((err) => {
    // database.put(studentDesignDoc)
    //   .then((res) => runningInTestMode ? f=>f : console.log(res))
    //   .then(createLogEntryOptions(database, runningInTestMode))
    createDesignDocs(database, runningInTestMode)
  })

database.compact()
  .then(res => runningInTestMode ? f=>f : console.log("Compacting database", res))
  .catch(err => { console.log(err) })

window.database = database

module.exports = database
