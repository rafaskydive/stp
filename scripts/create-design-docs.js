var PouchDB = require('pouchdb')

var database = new PouchDB('http://doppler:doppler@localhost:5984/my-pouch-db')

var docs = {
  docs: [
    {
      _id: "_design/students",
      views: {
        name: {
          map: function(doc) {
            if(doc.type === "student") {
              emit(doc.name, null)
            }
          }.toString()
        },
        last_jump_date: {
          map: function(doc) {
            if(doc.type === "student" && doc.last_jump_date) {
              emit(doc.last_jump_date, null)
            }
          }.toString()
        },
        jumps_by_month: {
          map: function(doc) {
            if(doc.type === "student" && doc.jumps) {
              for(var i in doc.jumps) {
                emit(doc.jumps[i].jump_date.split(/T/)[0].split(/-/), 1)
              }
            }
          }.toString(),
          reduce: '_count'
        }
      }
    }
  ]
}

database.bulkDocs(docs, function(err, response) {
  if (err) { return console.log(err) }
  console.log(response)
})
