require('dotenv').config()

const dbName = process.env.DB_NAME

if(dbName === undefined) {
  console.log("Please provide a database name.")
  process.exit()
}

var dbStr = "http://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_HOST + ":5984/" + process.env.DB_NAME

var PouchDB = require('pouchdb')

var database = new PouchDB(dbStr)

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
