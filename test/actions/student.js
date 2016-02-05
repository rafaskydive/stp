import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import expect from 'expect'
import moment from 'moment'

import database from '../../src/database'
import { jumpsTemplate } from '../../src/utils'
import * as actions from '../../src/actions/student'
import * as types from '../../src/constants'

const ACTIONS = Object.keys(actions)

function markAsTested(action) {
  ACTIONS.splice(ACTIONS.indexOf(action), 1)
}

after(() => {
  console.log('UNTESTED ACTIONS (student)', ACTIONS)
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
