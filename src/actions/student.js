const path = require('path')
import * as types from '../constants'
import database from '../database'
import config from '../config'
import { routeActions } from 'redux-simple-router'
import { jumpsTemplate } from '../utils'
import moment from 'moment'

export function newStudent(callback) {
  let payload = { new: true, type: 'student', jumps: jumpsTemplate(moment().format()) }
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

export function saveStudent(student) {
  return dispatch => {
    dispatch({ type: types.REQUEST_PUT_STUDENT})
    if(! student._id || student._id === "new") {
      student._id = student.name.replace(/ /g, '-').toLowerCase()
    }
    delete(student.modified)
    delete(student.new)
    // copy latest jump_date from jumps{} to student.last_jump_date
    student.last_jump_date = Object.keys(student.jumps).map(key => {
      return student.jumps[key].jump_date
    }).sort((a, b) => {
      return a > b
    }).pop()    
    database.put(student, function (err, response) {
      if (err) { console.log(err) }
      return dispatch(fetchStudent(response.id))
    })
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
  student.jumps[jump._id][field] = value
  return {
    type: types.EDIT_STUDENT_FIELD,
    payload: student
  }
}

export function createNextJump(student) {
  return dispatch => {
    database.get(student._id, function (err, student) {
      if (err) { return console.log(err) }
      let newJumpObj = jumpsTemplate(moment().format())
      let newJumpKey = Object.keys(newJumpObj)[0]
      let newJump = newJumpObj[newJumpKey]
      let sortedKeys = Object.keys(student.jumps).sort((a, b) => { return a > b})
      if (sortedKeys.length > 0) {
        let lastKey = sortedKeys.pop()
        let lastJump = student.jumps[lastKey]
        newJump.dive_flow = lastJump.dive_flow + 1
        newJump.jump_number = lastJump.jump_number + 1
        newJump.instructor = lastJump.instructor
      }
      student.jumps[newJumpKey] = newJump
      dispatch({
        type: types.CREATE_NEXT_JUMP
      })
      dispatch(saveStudent(student))
    })
  }
}

export function removeJump(student, key) {
  return dispatch => {
    database.get(student._id, function (err, student) {
      if (err) { return console.log(err) }
      let video_file = student.jumps[key].video_file
      if (video_file) {
        let videoFilePath = path.join(config.videoFilePath, student._id, video_file)
        console.log('removing video_file', videoFilePath)
        fs.unlink(videoFilePath, (err) => {
          if (err) { return console.log(err) }
          delete student.jumps[key]
        })
      }
      delete student.jumps[key]
      dispatch(saveStudent(student))
    })
  }
}

export function removeVideo(student, jump) {
  return dispatch => {
    let video_file = student.jumps[jump._id].video_file
    let videoFilePath = path.join(config.videoFilePath, student._id, video_file)
    console.log('removing video_file', videoFilePath)
    fs.unlink(videoFilePath, (err) => {
      if (err) { return console.log(err) }
      console.log('removed', videoFilePath)
    })
    delete student.jumps[jump._id].video_file
    dispatch(saveStudent(student))
  }
}
