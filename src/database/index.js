var PouchDB = require('pouchdb')

var adapter = 'idb';

var database = process.env['NODE_ENV']==='development' ? new PouchDB('http://localhost:5984/test-db', {adapter: 'http'}) : new PouchDB('STP', {adapter: adapter})

const synctest = PouchDB.sync('STP-TEST', 'http://localhost:5984/test-db', {live: true, retry: true})

const sync = PouchDB.sync('STP', 'http://localhost:5984/my-pouch-db', {
  live: true,
  retry: true
})

module.exports = database
