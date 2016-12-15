const docData = require('./log-entry-options')

export default function (database) {
  const newdoc = {}

  const keys = Object.keys(docData)

  keys.forEach(function(key) {
    const obj = docData[key].map(function(arr, i) {
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
    .catch(function(err) { database.put(newdoc) })
}
