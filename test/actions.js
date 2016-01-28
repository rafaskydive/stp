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

const now = moment().format()

import database from '../src/database'

console.log(process.env['NODE_ENV'])

describe('sync actions', () => {

  it('newStudent should return an object with new:true', () => {
    const jumps = jumpsTemplate(moment().format())
    const payload = {
      new: true,
      type: 'student',
      jumps: jumps
    }
    const expected = {
      type: types.NEW_STUDENT,
      payload
    }
    expect(actions.newStudent(e=>{})).toEqual(expected)
  })

  it('editStudentField should return an object with field name and value', () => {
    const expected = {
      type: types.EDIT_STUDENT_FIELD,
      payload: { email: "f" }
    }
    expect(actions.editStudentField({email:""},"email","f")).toEqual(expected)
  })

})

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('async actions', () => {

  before(function() {
    return (
      database.get('test-student').then(doc => {
        return database.remove(doc._id, doc._rev)
      }).then(result => {}).catch(err => {})
    )
  })

  it('saveStudent creates REQUEST_PUT_STUDENT, saves student, then creates fetchStudent stuff', (done) => {

    const newStudent = {
      type: 'student',
      name: `Test Student`,
      email: 'test@example.com',
      phone: '123-456-7890',
      jumps: [{
        _id: `1-${now}`,
        dive_flow: 1,
        date: now,
        instructor: "",
        notes: ""
      }]
    }

    const expectedActions = [
      { type: types.REQUEST_PUT_STUDENT },
      { type: types.REQUEST_STUDENT },
      (incomingAction) => {
        if (incomingAction.type !== 'RECIEVE_STUDENT' ) { throw Error('Expected action of type RECIEVE_STUDENT') }
        if (incomingAction.payload._id !== 'test-student' ) { throw Error('Expected payload _id to be student-name (test-student)')}
        if (! incomingAction.payload._rev) { throw Error('Expected payload to have _rev') }
      }
    ]

    const store = mockStore({ student: newStudent }, expectedActions, done)

    store.dispatch(actions.saveStudent(newStudent))
  })

  it('fetchStudent creates RECIEVE_STUDENT after fetching students', (done) => {

    const expectedActions = [
      { type: types.REQUEST_STUDENT },
      (incomingAction) => {
        if( ! incomingAction.payload._rev ) { throw Error('Expected fetchStudent to return a doc with a _rev')}
      }
    ]

    const store = mockStore({ student: {} }, expectedActions, done)
    store.dispatch(actions.fetchStudent("test-student-two"))
  })

  it('fetchStudents should return RECIEVE_STUDENTS and an array of docs', (done) => {

    const expectedActions = [
      {
        type: types.REQUEST_STUDENTS
      },
      (incomingAction) => {
        if( ! incomingAction.payload.length ) { throw "Expected payload to be an array"}
      }
    ]
    const store = mockStore({ studentList: [] }, expectedActions, done)
    store.dispatch(actions.fetchStudents())
  })

  it('copyVideoFile dispatches COPY_IN_PROGRESS and COPY_COMPLETE', (done) => {
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

})
