const path = require('path')
import _ from 'lodash'
import * as types from '../constants/studentConstants'
import database from '../database'
import { routeActions } from 'react-router-redux'
import { jumpsTemplate } from '../utils'
import moment from 'moment'

export function newStudent(testUUID) {
  // testUUID should only be used by tests. It sets a specified UUID on
  // the generated Jump
  let payload = { new: true, type: 'student', jumps: [jumpsTemplate(moment().format(), testUUID)] }
  return {
    type: types.STUDENT_NEW,
    payload
  }
}

function requestStudent() {
  return {
    type: types.STUDENT_REQUEST,
  }
}

function receiveStudent(json) {
  return {
    type: types.STUDENT_RECIEVE,
    payload: json
  }
}

export function fetchStudent(_id) {
  if(_id === 'new') { return }
  return dispatch => {
    dispatch(requestStudent())
    return database.get(_id)
      .then((doc) => { dispatch(receiveStudent(doc))})
      .catch((err) => {
        dispatch(reportErrors({errors:err}))
      })
  }
}

function reportErrors(student) {
  return {
    type: types.STUDENT_SAVE_ERROR,
    payload: student
  }
}

export function saveStudent(student) {
  return dispatch => {
    if(! student._id || student._id === "new") {
      student._id = student.name.replace(/ /g, '-').toLowerCase()
      student.original_name = student.name // this is so we can always reference the video directory even if somone changes the name of the student
    }

    student.jumps = _.sortBy(student.jumps, ['jump_date', 'dive_flow'])

    if ( student.email === "_delete@me" ) { student._deleted = true }

    delete(student.modified)
    delete(student.new)
    delete(student.errors)

    student.last_jump_date = Object.keys(student.jumps).map(key => {
      return student.jumps[key].jump_date
    }).sort((a, b) => {
      return a > b
    }).pop() || ""

    return database.put(student)
      .then(response => dispatch(fetchStudent(response.id)))
      .catch((err) => {
        student.errors = err
        dispatch(reportErrors(student))
      })
  }
}

export function createNote (student) {
  return { type: types.STUDENT_CREATE_NOTE }
}

export function cancelNote (student) {
  delete student.new_note
  delete student.errors
  return { type: types.STUDENT_CANCEL_NOTE, payload: student }
}

export function changeNoteField(student, field, value) {
  student.new_note[field] = value
  return { type: types.STUDENT_CHANGE_NOTE, payload: student }
}

export function saveNote(student) {
  return dispatch => {
    if( !student.new_note.text || student.new_note.text.trim() === "") {
      Object.assign(student, {errors: ['Note text may not be blank']})
      return dispatch(reportErrors(student))
    } else {
      student.new_note.date = moment().format()
      student.notes.push(student.new_note)
      delete student.new_note
      return dispatch(saveStudent(student))
    }
  }
}

export function removeNote(student, note) {
  return dispatch => {
    let _note = student.notes.find(n => {
      return n.date === note.date
    })
    student.notes.splice(student.notes.indexOf(_note), 1)
    return dispatch(saveStudent(student))
  }
}

export function enableStudentEditForm() {
  return {
    type: types.STUDENT_ENABLE_FORM,
  }
}

export function disableStudentEditForm(student) {
  return dispatch => {
    dispatch( { type: types.STUDENT_DISABLE_FORM } )
    return dispatch(fetchStudent(student._id))
  }
}

function manipulatePhoneValue(value) {
  // TODO: make this smarter so backspace will work past symbols
  value = value.replace(/[^\d]/g, '')
  let manipulatedValue
  if (value.length === 3) { manipulatedValue = `(${value.match(/\d+/)}) `}
  console.log(value, value.length)
  if (value.length > 3 && value.length <=5) {
    let parts = value.match(/(\d{3})(\d+)/)
    console.log(parts)
    manipulatedValue = `(${parts[1]}) ${parts[2]}`
  }
  if (value.length >= 6) {
    let parts = value.match(/(\d{3})(\d{3})(\d{0,4})/)
    console.log(parts)
    manipulatedValue = `(${parts[1]}) ${parts[2]}-${parts[3]}`
  }
  return manipulatedValue
}

export function editStudentField(student, field, value) {
  if (field === "phone") { value = manipulatePhoneValue(value) }
  student[field] = value
  return {
    type: types.STUDENT_EDIT_FIELD,
    payload: student
  }
}

export function editJumpField(student, jump, field, value) {
  if(field === 'dive_flow' || field === 'jump_number') { value = Number(value)}
  let _jump = student.jumps.find(j => {
    return j.id == jump.id
  })
  _jump[field] = value
  return {
    type: types.STUDENT_EDIT_FIELD,
    payload: student
  }
}

export function setInstructorOnFirstJump(student, instructor) {
  student.jumps[0].instructor = instructor
  return {
    type: types.STUDENT_SET_INSTRUCTOR_ON_FIRST_JUMP,
    payload: student
  }
}

export function createNextJump(_student) {
  return dispatch => {
    return database.get(_student._id)
      .then((student) => {
        let newJump = jumpsTemplate(moment().format())
        let lastJump = student.jumps[student.jumps.length-1]
        if ( ! lastJump ) { lastJump = newJump }
        else {
          newJump.dive_flow = lastJump.dive_flow + 1
          newJump.jump_number = lastJump.jump_number + 1
          newJump.instructor = lastJump.instructor
        }
        student.jumps.push(newJump)
        dispatch({type: types.STUDENT_CREATE_NEXT_JUMP})
        return dispatch(saveStudent(student))
      })
      .catch((err) => {
        student.errors = err
        dispatch(reportErrors(student))
      })
  }
}

export function removeJump(student, jump) {
  return dispatch => {
    database.get(student._id, function (err, student) {
      if (err) { return console.log(err) }
      // one jump must remain or weird shit happens
      if (student.jumps.length === 1) {
        Object.assign(student, {errors: ['Student must have at least one jump']})
        return dispatch(reportErrors(student))
      }
      let _jump = student.jumps.find(j => {
        return j.id === jump.id
      })
      let video_file = _jump.video_file
      if (video_file) {
        let videoFilePath = path.join(settings.videoFilePath, student._id, video_file)
        fs.unlink(videoFilePath, (err) => {
          if (err) { return console.log(err) }
        })
      }
      student.jumps.splice(student.jumps.indexOf(_jump), 1)
      dispatch(saveStudent(student))
    })
  }
}

export function removeVideo(student, jump, settings, fs) {
  return dispatch => {
    let video_file = student.jumps.find(j => {
      return j.id === jump.id
    }).video_file
    let videoFilePath = path.join(settings.videoFilePath, student.original_name, video_file)
    fs.unlink(videoFilePath, (err) => {
      if (err) { return console.log(err) }
    })
    student.jumps.find(j => {
      return j.id === jump.id
    }).video_file = ""
    dispatch(saveStudent(student))
  }
}

export function deleteStudent(student, settings, push) {
  return dispatch => {
    dispatch({type: types.STUDENT_DELETE})
    let studentVideoDir = path.join(settings.videoFilePath, student._id)
    rimraf(studentVideoDir, function (err, result) {
      if (err) { console.log (err) }
      student._deleted = true
      database.put(student, function(err, response) {
        if (err) { console.log (err) }
        push('/')
      })
    })
  }
}
