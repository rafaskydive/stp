const dbName = process.argv[2]

if(dbName === undefined) {
  console.log("Please provide a database name.")
  process.exit()
}

var PouchDB = require('pouchdb')

var database = new PouchDB('http://doppler:doppler@localhost:5984/' + dbName)

var docData = require('./log-entry-options')

var newdoc = {}

var keys = Object.keys(docData)

keys.forEach(function(key) {
  var obj = docData[key].map(function(arr, i) {
    return {value: docData[key][i], label: docData[key][i]}
  })
  newdoc[key] = obj
})
newdoc._id = "_design/logEntryOptions"

database.get(newdoc._id)
  .then(function(doc) {
    newdoc._rev = doc._rev
    return database.put(newdoc)
  })
  .then(function(result) { console.log(result) })
  .catch(function(err) { console.log(err) })
