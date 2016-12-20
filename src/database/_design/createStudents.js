const studentsDesignDoc = {
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

export default function (database, runningInTestMode) {
  database.put(studentsDesignDoc)
    .then(res => runningInTestMode ? f => f : console.log(res))
    .catch(err => console.log(err))
}
