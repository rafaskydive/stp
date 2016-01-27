var PouchDB = require('pouchdb')

var database = new PouchDB('STP')

const sync = PouchDB.sync('STP', 'http://localhost:5984/my-pouch-db', {
  live: true,
  retry: true
})

module.exports = database
