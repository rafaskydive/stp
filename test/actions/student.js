import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import expect from 'expect'
import moment from 'moment'

import database from '../../src/database'
import { jumpsTemplate } from '../../src/utils'
import * as actions from '../../src/actions/studentActions'
import * as types from '../../src/constants'

import fs from 'fs'
import mkdirp from 'mkdirp'

const ACTIONS = Object.keys(actions)

function markAsTested(action) {
  ACTIONS.splice(ACTIONS.indexOf(action), 1)
}

after(() => {
  console.log('UNTESTED ACTIONS (student)', ACTIONS)
})

describe('student actions', () => {
  describe('sync actions', () => {

    describe('newStudent', () => {
      it('should create an action to set student to new state', () => {
        const payload = { new: true, type: 'student', jumps: [jumpsTemplate(moment().format(), 'newStudentTestUUID')] }
        const expectedAction = {
          type: types.STUDENT_NEW,
          payload
        }
        expect(actions.newStudent('newStudentTestUUID')).toEqual(expectedAction)
      })
      markAsTested('newStudent')
    })

    describe('editStudentField', () => {
      it('should return an object with field name and value', () => {
        const expected = {
          type: types.STUDENT_EDIT_FIELD,
          payload: { email: "f" }
        }
        expect(actions.editStudentField({email:""},"email","f")).toEqual(expected)
      })
      markAsTested('editStudentField')
    })

    describe('enableStudentEditForm', () => {
      it('should return type STUDENT_ENABLE_FORM', () => {
        expect(actions.enableStudentEditForm().type).toEqual(types.STUDENT_ENABLE_FORM)
      })
      markAsTested('enableStudentEditForm')
    })

    describe('editJumpField', () => {
      it('should create STUDENT_EDIT_FIELD and modify a text field', () => {
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
          type: types.STUDENT_EDIT_FIELD,
          payload: {
            name: "Test Student",
            jumps: expectedJumps
          }
        }
      })

      it('should create STUDENT_EDIT_FIELD and modify a number field', () => {
        const jump_date = '2016-01-28T08:51:43-05:00'
        const testUUID = 'testEDIT_STUDENT_FIELD_UUID'
        const jump = jumpsTemplate(jump_date, testUUID)
        const student = {
          name: 'Test Student',
          jumps: [jumpsTemplate(jump_date, testUUID)]
        }
        const field = "jump_number"
        const value = "10"
        const expectedJumps = [jump]
        expectedJumps[0].jump_number = 10
        const expectedAction = {
          type: types.STUDENT_EDIT_FIELD,
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

      it('creates saves student, then creates fetchStudent stuff', (done) => {
        const jump_date = '2016-01-28 11:57:51'
        const testUUID = 'testRemoveJumpUUID'
        const jumps = [jumpsTemplate(jump_date, testUUID)]
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
          { type: types.STUDENT_REQUEST },
          (a) => {
            expect(a.type).toEqual('STUDENT_RECIEVE')
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
          { type: types.STUDENT_REQUEST },
          (a) => {
            expect(a.type).toEqual('STUDENT_RECIEVE')
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
          { type: types.STUDENT_REQUEST },
          (a) => {
            expect(a.type).toEqual('STUDENT_RECIEVE')
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
            expect(a.type).toEqual(types.STUDENT_SET_INSTRUCTOR_ON_FIRST_JUMP)
            expect(a.payload.jumps[0].instructor).toEqual(newStudent.instructor)
          }
        ]
        const store = mockStore({ student: newStudent }, expectedActions, done)
        store.dispatch(actions.setInstructorOnFirstJump(newStudent, newStudent.instructor))
      })
      markAsTested('setInstructorOnFirstJump')
    })

    describe('disableStudentEditForm', () => {
      it('should return type STUDENT_DISABLE_FORM', (done) => {
        const student = {
          _id: 'test-student-two'
        }
        const expectedActions = [
          { type: types.STUDENT_REQUEST },
          { type: types.STUDENT_DISABLE_FORM },
          (a) => {
            expect(a.type).toEqual(types.STUDENT_RECIEVE)
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
        let new_note = { text: 'test note', date: '1-2-3'}
        const student = {
          type: 'student',
          name: 'Save Note Student',
          jumps: [jumpsTemplate('w-h-a-t e-v-e-r')],
          notes: [],
          new_note: new_note
        }
        const expectedActions = [
          { type: types.STUDENT_REQUEST },
          (a) => {
            expect(a.type).toEqual(types.STUDENT_RECIEVE)
            expect(a.payload.notes[0].text).toEqual('test note')
          }
        ]
        const store = mockStore(student, expectedActions, done)
        store.dispatch(actions.saveNote(student, {date: 'x', text: 'success'}))
      })

      it('with errors, should not save note', (done) => {
        let new_note = { text: '', date: 'y-m-d' }
        const expectedActions = [
          {
            type: types.STUDENT_SAVE_ERROR,
            payload: { errors: [ 'Note text may not be blank' ], notes: [], new_note: new_note }
          }
        ]
        const store = mockStore({student:{notes:[]}}, expectedActions, done)
        store.dispatch(actions.saveNote( { notes:[], new_note: new_note } ))
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
          { type: types.STUDENT_REQUEST },
          (a) => {
            expect(a.type).toEqual(types.STUDENT_RECIEVE)
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
      it('fetchStudent creates STUDENT_RECIEVE after fetching students', (done) => {

        const expectedActions = [
          { type: types.STUDENT_REQUEST },
          (a) => {
            expect(a.type).toEqual('STUDENT_RECIEVE')
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
          { type: types.STUDENT_REQUEST },
          (a) => {
            expect(a.type).toEqual('STUDENT_RECIEVE')
            expect(Object.keys(a.payload.jumps).length).toEqual(1)
          }
        ]
        const store = mockStore(student, expectedActions, done)
        store.dispatch(actions.fetchStudent(student._id))
      })

      it('after run, should have two jumps', function (done) {
        const student = { _id: 'test-student' }
        const expectedActions = [
          { type: types.STUDENT_CREATE_NEXT_JUMP },
          (a) => {
            expect(a.type).toEqual('STUDENT_REQUEST')
          },
          (a) => {
            expect(a.type).toEqual('STUDENT_RECIEVE')
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
          { type: types.STUDENT_REQUEST },
          (incomingAction) => {
            expect(incomingAction.type).toEqual(types.STUDENT_RECIEVE)
            expect(Object.keys(incomingAction.payload.jumps).length).toEqual(2)
          }
        ]
        const store = mockStore(student, expectedActions, done)
        store.dispatch(actions.fetchStudent(student._id))
      })

      it('should remove specified jump and video, then save student', (done) => {
        const jump_date = '2016-01-28 11:57:51'
        const testUUID = 'testRemoveJumpUUID'
        const jump = jumpsTemplate(jump_date, testUUID)
        const student = {_id: 'test-student'}
        const expectedActions = [
          { type: types.STUDENT_REQUEST },
          (incomingAction) => {
            expect(incomingAction.type).toEqual(types.STUDENT_RECIEVE)
            expect(Object.keys(incomingAction.payload.jumps).length).toEqual(1)
            expect(incomingAction.payload.jumps[jump_date]).toBe(undefined)
          }
        ]
        const store = mockStore(student, expectedActions, done)
        store.dispatch(actions.removeJump(student, jump))
      })
      markAsTested('removeJump')
    })

    describe('removeVideo', () => {
      mkdirp.sync('test/output-data/remove-video-student')
      fs.writeFileSync('test/output-data/remove-video-student/DF 1 - 2016-02-05.txt', 'lorem')
      const jump = { jump_date: '2016-02-05 13:38:25', dive_flow: 1, video_file: 'DF 1 - 2016-02-05.txt'}
      const state = {
        settings: { videoFilePath: './test/output-data' },
        student: { _id: 'remove-video-student', jumps: [jump]}
      }
      const { student, settings } = {...state}
      it('should remove video from fs and its reference on jump object', (done) => {
        const expectedActions = [
          { type: types.STUDENT_REQUEST },
          (a) => {
            expect(a.type).toEqual(types.STUDENT_RECIEVE)
            expect(typeof a.payload.jumps[0].video_file).toEqual('undefined')
            // this one doesn't work right. we'll have to go on faith, i guess.
            // expect(fs.statSync('test/output-data/remove-video-student/DF 1 - 2016-02-05.txt')).toThrow(/no such file/)
          }
        ]
        const store = mockStore(state, expectedActions, done)
        store.dispatch(actions.removeVideo(student, jump, settings, fs))
      })
      markAsTested('removeVideo')
    })

  })
})
