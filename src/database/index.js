var PouchDB = require('pouchdb')

var database = process.env['NODE_ENV']==='development' ? new PouchDB('STP-TEST') : new PouchDB('STP')

const synctest = PouchDB.sync('STP-TEST', 'http://localhost:5984/test-db', {live: true, retry: true})

const sync = PouchDB.sync('STP', 'http://localhost:5984/my-pouch-db', {
  live: true,
  retry: true
})

module.exports = database
