const path = require('path')
import * as types from '../constants'
import database from '../database'
import config from '../config'
import { routeActions } from 'redux-simple-router'
import { jumpsTemplate } from '../utils'
import moment from 'moment'

export function newStudent(callback) {
  let payload = { new: true, type: 'student', jumps: [jumpsTemplate(moment().format())] }
  return {
    type: types.NEW_STUDENT,
    payload
  }
}

function requestStudent() {
  return {
    type: types.REQUEST_STUDENT,
  }
}

function receiveStudent(json) {
  return {
    type: types.RECIEVE_STUDENT,
    payload: json
  }
}

export function fetchStudent(_id) {
  if(_id === 'new') { return }
  return dispatch => {
    dispatch(requestStudent())
    database.get(_id, function (err, doc) {
      dispatch(receiveStudent(doc))
    })
  }
}

function validateStudent(student) {
  student.errors = student.errors || []
  if(student.jumps.length < 1) {
    student.errors.push("Must have at least one jump")
  }
  student.notes.map(note => {
    if(note.text.trim() === "") {
      student.errors.push("Note text cannot be blank")
    }
  })
  return student
}

function reportErrors(student) {
  return {
    type: types.SAVE_STUDENT_ERROR,
    payload: student
  }
}

export function saveStudent(student) {
  return dispatch => {
    if(! student._id || student._id === "new") {
      student._id = student.name.replace(/ /g, '-').toLowerCase()
    }
    delete(student.modified)
    delete(student.new)
    delete(student.errros)
    student = validateStudent(student)
    if (student.errors.length > 0) {
      return dispatch(reportErrors(student))
    }
    // copy latest jump_date from jumps{} to student.last_jump_date
    student.last_jump_date = Object.keys(student.jumps).map(key => {
      return student.jumps[key].jump_date
    }).sort((a, b) => {
      return a > b
    }).pop() || ""
    dispatch({ type: types.REQUEST_PUT_STUDENT})
    database.put(student, function (err, response) {
      if (err) { console.log(err) }
      return dispatch(fetchStudent(response.id))
    })
  }
}

export function saveNote(student, note) {
  return dispatch => {
    student.notes.push(note)
    return dispatch(saveStudent(student))
  }
}

export function enableStudentEditForm() {
  return {
    type: types.ENABLE_STUDENT_EDIT_FORM,
  }
}

export function disableStudentEditForm(student) {
  return dispatch => {
    dispatch(fetchStudent(student._id))
    dispatch( { type: types.DISABLE_STUDENT_EDIT_FORM } )
  }
}

export function editStudentField(student, field, value) {
  student[field] = value
  return {
    type: types.EDIT_STUDENT_FIELD,
    payload: student
  }
}

export function editJumpField(student, jump, field, value) {
  value = value.match(/(\d+)/) ? Number(value) : value
  let _jump = student.jumps.find(j => {
    return j.jump_date == jump.jump_date
  })
  _jump[field] = value
  return {
    type: types.EDIT_STUDENT_FIELD,
    payload: student
  }
}

export function setInstructorOnFirstJump(student, instructor) {
  student.jumps[0].instructor = instructor
  return {
    type: types.SET_INSTRUCTOR_ON_FIRST_JUMP,
    payload: student
  }
}

export function createNextJump(student) {
  return dispatch => {
    database.get(student._id, function (err, student) {
      if (err) { return console.log(err) }
      let newJump = jumpsTemplate(moment().format())
      let lastJump = student.jumps.sort((a, b) => {
        return a.jump_date < b.jump_date
      })[0]
      if ( ! lastJump ) { lastJump = newJump }
      else {
        newJump.dive_flow = lastJump.dive_flow + 1
        newJump.jump_number = lastJump.jump_number + 1
        newJump.instructor = lastJump.instructor
      }
      student.jumps.push(newJump)
      dispatch({
        type: types.CREATE_NEXT_JUMP
      })
      dispatch(saveStudent(student))
    })
  }
}

export function removeJump(student, jump) {
  return dispatch => {
    database.get(student._id, function (err, student) {
      if (err) { return console.log(err) }
      let _jump = student.jumps.find(j => {
        return j.jump_date === jump.jump_date
      })
      let video_file = _jump.video_file
      if (video_file) {
        let videoFilePath = path.join(config.videoFilePath, student._id, video_file)
        fs.unlink(videoFilePath, (err) => {
          if (err) { return console.log(err) }
        })
      }
      student.jumps.splice(student.jumps.indexOf(_jump), 1)
      dispatch(saveStudent(student))
    })
  }
}

export function removeVideo(student, jump) {
  return dispatch => {
    let video_file = student.jumps.find(j => {
      return j.jump_date === jump.jump_date
    }).video_file
    let videoFilePath = path.join(config.videoFilePath, student._id, video_file)
    console.log('removing video_file', videoFilePath)
    fs.unlink(videoFilePath, (err) => {
      if (err) { return console.log(err) }
      console.log('removed', videoFilePath)
    })
    delete student.jumps.find(j => {
      return j.jump_date === jump.jump_date
    }).video_file
    dispatch(saveStudent(student))
  }
}
