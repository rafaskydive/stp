var PouchDB = require('pouchdb')

var database = new PouchDB('http://localhost:5984/my-pouch-db')

module.exports = database
