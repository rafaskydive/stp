var faker = require('faker')
var moment = require('moment')
var uuid = require('uuid')
var PouchDB = require('pouchdb')

database = new PouchDB('http://localhost:5984/my-pouch-db')

var instructors = ['David Rose', 'James Englund', 'Kevin Purdy']

var fakeStudent = function() {
  var name = faker.name.firstName() + ' ' + faker.name.lastName()
  var _id = name.replace(/([^a-z]+)/ig,'-').toLowerCase()
  var instructor = faker.random.arrayElement(instructors)
  var jumps = []
  var notes = []

  for(var x = 1; x <= Math.floor(Math.random()*18); x++) {
    var jump = {
      id: uuid.v4(),
      jump_date: moment(faker.date.recent(90)).format(),
      instructor: faker.random.arrayElement(instructors)
    }
    jumps.push(jump)
  }

  sortedJumps = jumps.sort(function(a, b) {
    console.log(new Date(a.jump_date))
    return new Date(a.jump_date) - new Date(b.jump_date)
  })

  datedJumps = sortedJumps.map(function(jump, i) {
    jump.jump_number = i + 3
    jump.dive_flow = i + 1
    return jump
  })

  for(var x = 1; x <= Math.floor(Math.random()*18); x++) {
    var note = {
      date: moment(faker.date.recent(60)).format(),
      text: faker.lorem.sentence()
    }
    notes.push(note)
  }

  var student = {
    _id: _id,
    type: "student",
    name: name,
    email: faker.internet.email(),
    phone: faker.phone.phoneNumberFormat(),
    instructor: instructor,
    jumps: datedJumps,
    notes: notes
  }

  student.last_jump_date = Object.keys(student.jumps).map(key => {
    return student.jumps[key].jump_date
  }).sort((a, b) => {
    return a > b
  }).pop() || ""

  return student
}

var students = []

for(var x = 0; x <= 25; x++) {
  students.push(fakeStudent())
}

database.bulkDocs(students).then(response => {
  console.log(response)
})
