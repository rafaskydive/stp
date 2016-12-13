const dbName = process.argv[2]

if(dbName === undefined) {
  console.log("Please provide a database name.")
  process.exit()
}

var PouchDB = require('pouchdb')

var database = new PouchDB('http://doppler:doppler@localhost:5984/' + dbName)

var docData = {
  exit: [
    "Team poised",
    "Solo poised",
    "Diving"
  ],
  maneuvers: [
    "Practice touches",
    "Good altitude awareness",
    "Left/Right 90 degree turns",
    "Left/Right 360 degree turns",
    "Barrel roll",
    "Front loop",
    "Back loop",
    "Good swoop",
    "Dock with instructor grips",
    "Dock with student grips"
  ]
}

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
