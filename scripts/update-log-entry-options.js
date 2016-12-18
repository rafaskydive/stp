require('dotenv').config()
var PouchDB = require('pouchdb')

var dbStr = "http://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_HOST + ":5984/" + process.env.DB_NAME

var database = new PouchDB(dbStr)

var createLogEntryOptions = require('../src/database/_design/create-log-entry-options').default

createLogEntryOptions(database)
