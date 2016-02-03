var PouchDB = require('pouchdb')

var database = process.env['NODE_ENV']==='development' ? new PouchDB('test', {db: require('memdown')}) : new PouchDB('STP', {adapter: 'idb'})

const sync = PouchDB.sync('STP', 'http://localhost:5984/my-pouch-db', {
  live: true,
  retry: true
})

module.exports = database
