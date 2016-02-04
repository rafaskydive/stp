var PouchDB = require('pouchdb')
var settings = require('../../settings')

var database = process.env['NODE_ENV']==='development' ?
  new PouchDB('test', {db: require('memdown')}) :
  new PouchDB(settings.localDatabase, {adapter: 'idb'})

if(settings.remoteDatabase) {
  const sync = PouchDB.sync(settings.localDatabase, settings.remoteDatabase, {
    live: true,
    retry: true
  })
}

module.exports = database
