import PouchDB from 'pouchdb'

const database = new PouchDB('http://doppler@doppler@localhost:5984/my-pouch-db')

export default database

const ddoc = {
  _id: "_design/app",
  views: {
    by_name: (doc) => {
      if (doc.type === "student") {
        return emit(doc.name);
      }
    }
  }
}

export function saveDdoc() {
  database.put(ddoc)
    .catch(err => {
      console.log("err:", err)
    })
}

export function jumpsTemplate() {
  const jump = {
    dive_flow: "DF 0",
    date: null,
    instructor: "",
    repeat: false,
    notes: ""
  }
  const jumps = []
  for ( let x = 1; x <= 18; x++ ) {
    jump.dive_flow = `DF ${x}`
    jumps.push(jump)
  }
  return jumps
}
