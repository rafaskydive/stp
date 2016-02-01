// var database = require('../src/database')
var PouchDB = require('pouchdb')

var database = new PouchDB('http://doppler:doppler@localhost:5984/my-pouch-db')

function deleteDocs(callback) {
  var deleteDocs = []
  database.allDocs({include_docs:true}, function(err, response) {
    if (err) { console.log(err) }
    console.log(response)
    response.rows.forEach(function(row) {
      row.doc._deleted = true
      deleteDocs.push(row.doc)
    })
    console.log(deleteDocs)
    database.bulkDocs(deleteDocs, function(err, response) {
      if (err) { console.log(err) }
      console.log(response)
      callback()
    })

  })
}

function initialDocs() {
  return (
    {
      docs: [
        {
          _id: '_design/app',
          views: {
            by_name: {
              "map": "function(doc) {\n  if(doc.type==='student'){emit(doc)}\n}"
            }
          }
        },
        {
          _id: "instructors",
          type: "instructors",
          instructors: [
            "David Rose",
            "James Englund",
            "Kevin Purdy"
          ]
        }
      ]
    }
  )
}

var repopulate = function () {
  database.bulkDocs(initialDocs(), function(err, response) {
    if (err) { return console.log(err) }
    console.log(response)
  })
}

deleteDocs(repopulate)
