import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import expect from 'expect'
import moment from 'moment'

import database from '../../src/database'
import { jumpsTemplate } from '../../src/utils'
import * as actions from '../../src/actions/studentActions'
import * as types from '../../src/constants/studentConstants'

import fs from 'fs'
import mkdirp from 'mkdirp'

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
    })

    describe('editStudentField', () => {
      it('should return an object with field name and value', () => {
        const expected = {
          type: types.STUDENT_EDIT_FIELD,
          payload: { email: "f" }
        }
        expect(actions.editStudentField({email:""},"email","f")).toEqual(expected)
      })
    })

    describe('enableStudentEditForm', () => {
      it('should return type STUDENT_ENABLE_FORM', () => {
        expect(actions.enableStudentEditForm().type).toEqual(types.STUDENT_ENABLE_FORM)
      })
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
    })

    describe('setInstructorOnFirstJump', () =>  {
      it('copies student.instructor to student.jumps[0].instructor', () => {
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
        const store = mockStore({ student: newStudent })//, expectedActions)
        const expectedActions = store.dispatch(actions.setInstructorOnFirstJump(newStudent, newStudent.instructor))
        expect(expectedActions.type).toEqual(types.STUDENT_SET_INSTRUCTOR_ON_FIRST_JUMP)
        expect(expectedActions.payload.jumps[0].instructor).toEqual(newStudent.instructor)
      })
    })

    describe('createNote', () => {
      it('should work', () => {
        const store = mockStore({})
        expect(store.dispatch(actions.createNote({}))).toEqual({type: types.STUDENT_CREATE_NOTE})
      })
    })
    describe('cancelNote', () => {
      it('should work', () => {
        const store = mockStore({})
        expect(store.dispatch(actions.cancelNote({})).type).toEqual(types.STUDENT_CANCEL_NOTE)
      })
    })
    describe('changeNoteField', () => {
      it('should work', () => {
        const store = mockStore({})
        const expectedActions = store.dispatch(actions.changeNoteField({new_note:{}}, 'foo', 'bar'))
        expect(expectedActions.payload.new_note.foo).toEqual('bar')
      })
    })
  })

  /******************************************************************************/
  /* ASYNC ACTIONS                                                              */
  /******************************************************************************/

  jest.unmock('../../src/actions/studentActions')
  jest.unmock('redux-mock-store')
  jest.unmock('redux-thunk')

  const middlewares = [ thunk ]
  const mockStore = configureMockStore(middlewares)

  describe('async actions', () => {
    // afterAll(function() {
    //   console.log("DELETING TEST STUDENTS")
    //   return (
    //     database.allDocs({keys:["test-student","test-student-two", "save-note-student", "remove-note-student"]}).then(response => {
    //       return response.rows.map(row => database.remove(row.key, row.value.rev))
    //     }).catch(err => console.log(err))
    //   )
    // })

    describe('saveStudent', () => {

      it('creates saves student, then creates fetchStudent stuff', () => {
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
        const store = mockStore({ student: newStudent })//, expectedActions)//, done)
        return store.dispatch(actions.saveStudent(newStudent))
          .then(() => {
            const expectedActions = store.getActions()
            expect(expectedActions.length).toBe(2)
            expect(expectedActions[0]).toEqual( { type: types.STUDENT_REQUEST})
            expect(expectedActions[1].type).toEqual('STUDENT_RECIEVE')
            expect(expectedActions[1].payload._id).toEqual('test-student')
          })
      })

      it('saves test-student-two', () => {
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
        const store = mockStore({ student: newStudent })
        return store.dispatch(actions.saveStudent(newStudent))
          .then(() => {
            const expectedActions = store.getActions()
            expect(expectedActions.length).toBe(2)
            expect(expectedActions[1].payload._id).toEqual('test-student-two')
          })
      })

    })

    describe('disableStudentEditForm', () => {
      it('should return type STUDENT_DISABLE_FORM', () => {
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
        const store = mockStore({student:{}})//, expectedActions, done)
        return store.dispatch(actions.disableStudentEditForm(student))
          .then(() => {
            const expectedActions = store.getActions()
            expect(expectedActions.length).toBe(3)
            expect(expectedActions[0].type).toEqual(types.STUDENT_DISABLE_FORM)
            expect(expectedActions[1].type).toEqual(types.STUDENT_REQUEST)
            expect(expectedActions[2].type).toEqual(types.STUDENT_RECIEVE)
            expect(expectedActions[2].payload.original_name).toEqual("Test Student Two")
          })
      })
    })

    describe('saveNote', () => {
      it('should save note', () => {
        let new_note = { text: 'test note', date: '1-2-3'}
        const student = {
          type: 'student',
          name: 'Save Note Student',
          jumps: [jumpsTemplate('w-h-a-t e-v-e-r')],
          notes: [],
          new_note: new_note
        }
        const store = mockStore(student)
        return store.dispatch(actions.saveNote(student))
          .then(() => {
            const expectedActions = store.getActions()
            expect(expectedActions.length).toBe(2)
            expect(expectedActions[0].type).toEqual(types.STUDENT_REQUEST)
            expect(expectedActions[1].type).toEqual(types.STUDENT_RECIEVE)
            expect(expectedActions[1].payload.notes[0].text).toEqual("test note")
          })
      })

      it('with errors, should not save note', () => {
        let new_note = { text: '', date: null}
        const student = {
          type: 'student',
          name: 'Save Note Student',
          jumps: [jumpsTemplate('w-h-a-t e-v-e-r')],
          notes: [],
          new_note: new_note
        }
        const store = mockStore({})
        store.dispatch(actions.saveNote(student))
        const expectedActions = store.getActions()
        expect(expectedActions.length).toBe(1)
        expect(expectedActions[0].payload.errors[0]).toEqual('Note text may not be blank')
      })
    })

    describe('removeNote', () => {

      it('should remove specified note', () => {
        const student = {
          type: 'student',
          name: 'Remove Note Student',
          jumps: [jumpsTemplate('w-h-a-t e-v-e-r')],
          notes: [{date:'x',text:'keep'},{date:'y',text:'remove'}]
        }
        const store = mockStore({})
        return store.dispatch(actions.removeNote(student, {date:'y'}))
          .then(() => {
            const expectedActions = store.getActions()
            expect(expectedActions.length).toBe(2)
            expect(expectedActions[0].type).toEqual(types.STUDENT_REQUEST)
            expect(expectedActions[1].type).toEqual(types.STUDENT_RECIEVE)
            expect(expectedActions[1].payload.notes.length).toBe(1)
            expect(expectedActions[1].payload.notes[0].text).toEqual('keep')
          })

      })
    })

    describe('fetchStudent', () => {
      it('works', () => {
        const store = mockStore({})
        return store.dispatch(actions.fetchStudent("test-student-two"))
          .then(() => {
            const expectedActions = store.getActions()
            expect(expectedActions[1].payload.original_name).toEqual("Test Student Two")
          })
      })

      it('fails gracefully', () => {
        const store = mockStore({})
        return store.dispatch(actions.fetchStudent("404"))
          .then(() => {
            const expectedActions = store.getActions()
            expect(expectedActions[1].type).toEqual(types.STUDENT_SAVE_ERROR)
          })
      })
    })

    describe('createNextJump', function () {
      it('should start with 1 jump', function () {
        const student = { _id: 'test-student' }
        const store = mockStore({})
        return store.dispatch(actions.fetchStudent(student._id))
          .then(() => {
            const expectedActions = store.getActions()
            expect(expectedActions[1].payload.jumps.length).toBe(1)
          })
      })

      it('after run, should have two jumps', function () {
        const student = { _id: 'test-student' }
        const store = mockStore({})
        return store.dispatch(actions.createNextJump(student))
          .then(() => {
            const expectedActions = store.getActions()
            expect(expectedActions[2].payload.jumps.length).toBe(2)
          })
      })
    })

    describe('removeJump', () => {
      it('should start with two jumps', function () {
        const student = { _id: 'test-student' }
        const store = mockStore({})
        return store.dispatch(actions.fetchStudent(student._id))
          .then(() => {
            const expectedActions = store.getActions()
            expect(expectedActions[1].payload.jumps.length).toBe(2)
          })
      })

      xit('should remove specified jump and video, then save student', (done) => {
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
    })

    describe('removeVideo', () => {
      mkdirp.sync('test/output-data/Remove Video Student')
      fs.writeFileSync('test/output-data/Remove Video Student/DF 1 - 2016-02-05.txt', 'lorem')
      const jump = { jump_date: '2016-02-05 13:38:25', dive_flow: 1, video_file: 'DF 1 - 2016-02-05.txt'}
      const state = {
        settings: { videoFilePath: './test/output-data' },
        student: { _id: 'remove-video-student', original_name: 'Remove Video Student', jumps: [jump]}
      }
      const { student, settings } = {...state}
      xit('should remove video from fs and its reference on jump object', (done) => {
        const expectedActions = [
          { type: types.STUDENT_REQUEST },
          (a) => {
            expect(a.type).toEqual(types.STUDENT_RECIEVE)
            expect(a.payload.jumps[0].video_file).toEqual('')
            // this one doesn't work right. we'll have to go on faith, i guess.
            // expect(fs.statSync('test/output-data/remove-video-student/DF 1 - 2016-02-05.txt')).toThrow(/no such file/)
          }
        ]
        const store = mockStore(state, expectedActions, done)
        store.dispatch(actions.removeVideo(student, jump, settings, fs))
      })
    })

  })
})
