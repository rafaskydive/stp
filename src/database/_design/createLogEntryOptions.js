import docData from './log-entry-options'

export default function (database, runningInTestMode) {
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
        .then(res => runningInTestMode ? f => f : console.log(res))
        .catch(err => console.log(err))
    })
    .catch(function(err) {
      database.put(newdoc)
        .then(res => runningInTestMode ? f => f : console.log(res))
        .catch(err => console.log(err))
    })
}
