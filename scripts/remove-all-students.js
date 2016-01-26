var database = require('../src/database')

var deleteDocs = []

database.query('app/by_name', {include_docs:true}, function(err, response) {
  if (err) { console.log(err) }

  response.rows.forEach(function(row) {
    row.doc._deleted = true
    deleteDocs.push(row.doc)
  })
  console.log(deleteDocs)
  database.bulkDocs(deleteDocs, function(err, response) {
    if (err) { console.log(err) }
    console.log(response)
  })

})
