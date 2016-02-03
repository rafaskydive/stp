import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import expect from 'expect'
import * as actions from '../src/actions'
import * as types from '../src/constants'
import moment from 'moment'
import fs from 'fs'
import fse from 'fs-extra'
import mkdirp from 'mkdirp'
import path from 'path'
import { jumpsTemplate } from '../src/utils'

import database from '../src/database'

const ACTIONS = Object.keys(actions)

function markAsTested(action) {
  ACTIONS.splice(ACTIONS.indexOf(action), 1)
}

before(() => {
  database.put({
    _id: '_design/app',
    views: {
      by_name: {
        map: "function(doc){if(doc.type==='student'){emit(doc)}}"
      }
    }
  },
  function(err, result) {
    if(err){console.log(err)}
  })
})
after(() => {
  console.log('UNTESTED ACTIONS', ACTIONS)
})

describe('sync actions', () => {

  describe('newStudent', () => {
    it('should create an action to set student to new state', () => {
      const payload = { new: true, type: 'student', jumps: [jumpsTemplate(moment().format())] }
      const expectedAction = {
        type: types.NEW_STUDENT,
        payload
      }
      expect(actions.newStudent()).toEqual(expectedAction)
    })
    markAsTested('newStudent')
  })

  describe('editStudentField', () => {
    it('should return an object with field name and value', () => {
      const expected = {
        type: types.EDIT_STUDENT_FIELD,
        payload: { email: "f" }
      }
      expect(actions.editStudentField({email:""},"email","f")).toEqual(expected)
    })
    markAsTested('editStudentField')
  })

  describe('enableStudentEditForm', () => {
    it('should return type ENABLE_STUDENT_EDIT_FORM', () => {
      expect(actions.enableStudentEditForm().type).toEqual(types.ENABLE_STUDENT_EDIT_FORM)
    })
    markAsTested('enableStudentEditForm')
  })

  describe('editJumpField', () => {
    it('should create EDIT_STUDENT_FIELD and modify a text field', () => {
      const jump_date = '2016-01-28T08:51:43-05:00'
      const jump = jumpsTemplate(jump_date)
      const student = {
        name: 'Test Student',
        jumps: [jumpsTemplate(jump_date)]
      }
      const field = "instructor"
      const value = "Test Instructor"
      const expectedJumps = [jump]
      expectedJumps[0].instructor = "Test Instructor"
      const expectedAction = {
        type: types.EDIT_STUDENT_FIELD,
        payload: {
          name: "Test Student",
          jumps: expectedJumps
        }
      }
    })

    it('should create EDIT_STUDENT_FIELD and modify a number field', () => {
      const jump_date = '2016-01-28T08:51:43-05:00'
      const jump = jumpsTemplate(jump_date)
      const student = {
        name: 'Test Student',
        jumps: [jumpsTemplate(jump_date)]
      }
      const field = "jump_number"
      const value = "10"
      const expectedJumps = [jump]
      expectedJumps[0].jump_number = 10
      const expectedAction = {
        type: types.EDIT_STUDENT_FIELD,
        payload: {
          name: "Test Student",
          jumps: expectedJumps
        }
      }
      expect(actions.editJumpField(student, jump, field, value)).toEqual(expectedAction)
    })
    markAsTested('editJumpField')
  })

  describe('showStudent', () => {
    it('should create SHOW_STUDENT with the selected student', () => {
      const student = {
        _id: 'test-student'
      }
      const expectedAction = {
        type: types.SHOW_STUDENT,
        payload: student
      }
      expect(actions.showStudent(student)).toEqual(expectedAction)
    })
    markAsTested('showStudent')
  })

  describe('toggleSort', () => {
    it('should dispatch TOGGLE_SORT with payload of sortBy ', () => {
      const expectedAction = {
        type: types.TOGGLE_SORT,
        payload: { sortBy: 'name' }
      }
      expect(actions.toggleSort('name')).toEqual(expectedAction)
    })
    markAsTested('toggleSort')
  })

})

/******************************************************************************/
/* ASYNC ACTIONS                                                              */
/******************************************************************************/

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('async actions', () => {
  after(function() {
    console.log("DELETING TEST STUDENTS")
    return (
      database.allDocs({keys:["test-student","test-student-two", "test-student-three", "save-note-student", "remove-note-student"]}).then(response => {
        return response.rows.map(row => database.remove(row.key, row.value.rev))
      })
    )
  })

  describe('saveStudent', () => {

    it('creates REQUEST_PUT_STUDENT, saves student, then creates fetchStudent stuff', (done) => {
      const jump_date = '2016-01-28 11:57:51'
      const jumps = [jumpsTemplate(jump_date)]
      const newStudent = {
        type: 'student',
        subtype: 'test-student',
        name: `Test Student`,
        email: 'test@example.com',
        phone: '123-456-7890',
        jumps: jumps,
        notes: []
      }
      const expectedActions = [
        { type: types.REQUEST_PUT_STUDENT },
        { type: types.REQUEST_STUDENT },
        (a) => {
          expect(a.type).toEqual('RECIEVE_STUDENT')
          expect(a.payload._id).toEqual('test-student')
          expect(a.payload._rev).toNotEqual(undefined)
        }
      ]
      const store = mockStore({ student: newStudent }, expectedActions, done)
      store.dispatch(actions.saveStudent(newStudent))
    })

    it('saves test-student-two', (done) => {
      const jump_date = '2016-01-28 11:57:51'
      const jumps = jumpsTemplate(jump_date)
      const newStudent = {
        type: 'student',
        subtype: 'test-student',
        name: `Test Student Two`,
        email: 'test2@example.com',
        phone: '123-456-7890',
        jumps: jumps,
        notes: []
      }
      const expectedActions = [
        { type: types.REQUEST_PUT_STUDENT },
        { type: types.REQUEST_STUDENT },
        (a) => {
          expect(a.type).toEqual('RECIEVE_STUDENT')
          expect(a.payload._id).toEqual('test-student-two')
          expect(a.payload._rev).toNotEqual(undefined)
        }
      ]
      const store = mockStore({ student: newStudent }, expectedActions, done)
      store.dispatch(actions.saveStudent(newStudent))
    })

    it('copies latest jump_date from jump in jumps{} to last_jump_date', (done) => {
      const jump_date = '2016-01-29 12:00:00'
      const jumps = [jumpsTemplate(jump_date)]
      const newStudent = {
        type: 'student',
        subtype: 'test-student',
        name: 'Test Student Three',
        email: 'test@example.com',
        phone: '123-456-7890',
        jumps: jumps,
        notes: []
      }
      const expectedActions = [
        { type: types.REQUEST_PUT_STUDENT },
        { type: types.REQUEST_STUDENT },
        (a) => {
          expect(a.type).toEqual('RECIEVE_STUDENT')
          expect(a.payload._id).toEqual('test-student-three')
          expect(a.payload._rev).toNotEqual(undefined)
          expect(a.payload.last_jump_date).toEqual(jump_date)
        }
      ]
      const store = mockStore({ student: newStudent }, expectedActions, done)
      store.dispatch(actions.saveStudent(newStudent))
    })
    markAsTested('saveStudent')
  })

  describe('setInstructorOnFirstJump', () =>  {
    it('copies student.instructor to student.jumps[0].instructor', (done) => {
      const jump_date = '2016-01-29 12:00:00'
      const jumps = [jumpsTemplate(jump_date)]
      const newStudent = {
        type: 'student',
        subtype: 'test-student',
        name: 'Test Student Five',
        email: 'test@example.com',
        phone: '123-456-7890',
        instructor: 'Test Instructor',
        jumps: jumps,
        notes: []
      }
      const expectedActions = [
        (a) => {
          expect(a.type).toEqual(types.SET_INSTRUCTOR_ON_FIRST_JUMP)
          expect(a.payload.jumps[0].instructor).toEqual(newStudent.instructor)
        }
      ]
      const store = mockStore({ student: newStudent }, expectedActions, done)
      store.dispatch(actions.setInstructorOnFirstJump(newStudent, newStudent.instructor))
    })
    markAsTested('setInstructorOnFirstJump')
  })

  describe('disableStudentEditForm', () => {
    it('should return type DISABLE_STUDENT_EDIT_FORM', (done) => {
      const student = {
        _id: 'test-student-two'
      }
      const expectedActions = [
        { type: types.REQUEST_STUDENT },
        { type: types.DISABLE_STUDENT_EDIT_FORM },
        (a) => {
          expect(a.type).toEqual(types.RECIEVE_STUDENT)
          expect(a.payload._id).toEqual('test-student-two')
        }
      ]
      const store = mockStore({student:{}}, expectedActions, done)
      store.dispatch(actions.disableStudentEditForm(student))
    })
    markAsTested('disableStudentEditForm')
  })

  describe('saveNote', () => {
    it('should save note', (done) => {
      const student = {
        type: 'student',
        name: 'Save Note Student',
        jumps: [jumpsTemplate('w-h-a-t e-v-e-r')],
        notes: []
      }
      const expectedActions = [
        { type: types.REQUEST_PUT_STUDENT },
        { type: types.REQUEST_STUDENT },
        (a) => {
          expect(a.type).toEqual(types.RECIEVE_STUDENT)
          expect(a.payload.notes[0].text).toEqual('success')
        }
      ]
      const store = mockStore(student, expectedActions, done)
      store.dispatch(actions.saveNote(student, {date: 'x', text: 'success'}))
    })

    it('with errors, should not save note', (done) => {
      const expectedActions = [
        {
          type: types.SAVE_STUDENT_ERROR,
          payload: { errors: [ 'Note text may not be blank' ], student: { notes: [] } }
        }
      ]
      const store = mockStore({student:{notes:[]}}, expectedActions, done)
      store.dispatch(actions.saveNote({student:{notes:[]}}, {date: 'x', text: ''}))
    })
    markAsTested('saveNote')
  })

  describe('removeNote', () => {

    it('should remove specified note', (done) => {
      const student = {
        type: 'student',
        name: 'Remove Note Student',
        jumps: [jumpsTemplate('w-h-a-t e-v-e-r')],
        notes: [{date:'x',text:'keep'},{date:'y',text:'remove'}]
      }
      const expectedActions = [
        { type: types.REQUEST_PUT_STUDENT },
        { type: types.REQUEST_STUDENT },
        (a) => {
          expect(a.type).toEqual(types.RECIEVE_STUDENT)
          expect(a.payload.notes.length).toEqual(1)
          expect(a.payload.notes[0].text).toEqual('keep')
        }
      ]
      const store = mockStore(student, expectedActions, done)
      store.dispatch(actions.removeNote(student, {date:'y',text:'remove'}))
    })
    markAsTested('removeNote')
  })

  describe('fetchStudent', () => {
    it('fetchStudent creates RECIEVE_STUDENT after fetching students', (done) => {

      const expectedActions = [
        { type: types.REQUEST_STUDENT },
        (a) => {
          expect(a.type).toEqual('RECIEVE_STUDENT')
          expect(a.payload._id).toEqual('test-student-two')
          expect(a.payload._rev).toNotEqual(undefined)
        }
      ]

      const store = mockStore({ student: {} }, expectedActions, done)
      store.dispatch(actions.fetchStudent("test-student-two"))
    })
    markAsTested('fetchStudent')
  })

  describe('fetchStudents', () => {
    it('should return RECIEVE_STUDENTS and an array of docs', (done) => {

      const expectedActions = [
        {
          type: types.REQUEST_STUDENTS
        },
        (a) => {
          expect(a.payload).toBeAn(Array)
        }
      ]
      const store = mockStore({ studentList: [] }, expectedActions, done)
      store.dispatch(actions.fetchStudents())
    })
    markAsTested('fetchStudents')
  })

  describe('copyVideoFile', () => {
    it('dispatches COPY_IN_PROGRESS and COPY_COMPLETE', (done) => {
      let shouldExist = path.join('.', 'public', 'videos', 'test-case', 'DF 1 - 2016-01-23.test')
      const expectedActions = [
        { type: types.COPY_PROGRESS, payload: { percent: 0 } },
        { type: types.COPY_COMPLETE, payload: shouldExist}
      ]
      const store = mockStore({path:'./hello.testfile'}, expectedActions, done())

      fs.rmdir(path.dirname(shouldExist), () => {
        store.dispatch(actions.copyVideoFile(
          {_id: 'test-case'},
          {dive_flow: 1, date: '2016-01-23T16:19:12-05:00'},
          {path: './test/test-file.test'},
          fse
        ))
        // expect(fs.statSync(shouldExist).size).toEqual(32)
        fs.stat(shouldExist, (err, stats) => {
          if(err){console.log(err)}
          expect(stats.size).toEqual(44)
        })

      })
    })
    markAsTested('copyVideoFile')
  })

  describe('createNextJump', function () {
    it('should start with 1 jump', function (done) {
      const student = { _id: 'test-student' }
      const expectedActions = [
        { type: types.REQUEST_STUDENT },
        (a) => {
          expect(a.type).toEqual('RECIEVE_STUDENT')
          expect(Object.keys(a.payload.jumps).length).toEqual(1)
        }
      ]
      const store = mockStore(student, expectedActions, done)
      store.dispatch(actions.fetchStudent(student._id))
    })

    it('after run, should have two jumps', function (done) {
      const student = { _id: 'test-student' }
      const expectedActions = [
        { type: types.CREATE_NEXT_JUMP },
        { type: types.REQUEST_PUT_STUDENT },
        (a) => {
          expect(a.type).toEqual('REQUEST_STUDENT')
        },
        (a) => {
          expect(a.type).toEqual('RECIEVE_STUDENT')
          expect(Object.keys(a.payload.jumps).length).toEqual(2)
        }
      ]
      const store = mockStore(student, expectedActions, done)
      store.dispatch(actions.createNextJump(student))
    })
    markAsTested('createNextJump')
  })

  describe('removeJump', () => {
    it('should start with two jumps', function (done) {
      const student = { _id: 'test-student' }
      const expectedActions = [
        { type: types.REQUEST_STUDENT },
        (incomingAction) => {
          expect(incomingAction.type).toEqual(types.RECIEVE_STUDENT)
          expect(Object.keys(incomingAction.payload.jumps).length).toEqual(2)
        }
      ]
      const store = mockStore(student, expectedActions, done)
      store.dispatch(actions.fetchStudent(student._id))
    })

    it('should remove specified jump and video, then save student', (done) => {
      const jump_date = '2016-01-28 11:57:51'
      const jump = jumpsTemplate(jump_date)
      const student = {_id: 'test-student'}
      const expectedActions = [
        { type: types.REQUEST_PUT_STUDENT },
        { type: types.REQUEST_STUDENT },
        (incomingAction) => {
          expect(incomingAction.type).toEqual(types.RECIEVE_STUDENT)
          expect(Object.keys(incomingAction.payload.jumps).length).toEqual(1)
          expect(incomingAction.payload.jumps[jump_date]).toBe(undefined)
        }
      ]
      const store = mockStore(student, expectedActions, done)
      store.dispatch(actions.removeJump(student, jump))
    })
    markAsTested('removeJump')
  })
})
