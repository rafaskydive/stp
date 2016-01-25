import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import expect from 'expect'
import * as actions from '../src/actions'
import * as types from '../src/constants'
import moment from 'moment'
import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'

describe('sync actions', () => {

  it('newStudent should return an object with new:true', () => {
    const jumpsTemplate = [
      {
        dive_flow: 1,
        date: moment().format(),
        instructor: "",
        notes: ""
      }
    ]
    const payload = {
      new: true,
      type: 'student',
      jumps: jumpsTemplate
    }
    const expected = {
      type: types.NEW_STUDENT,
      payload: payload
    }
    expect(actions.newStudent()).toEqual(expected)
  })

  it('editStudentField should return an object with field name and value', () => {
    const expected = {
      type: types.EDIT_STUDENT_FIELD,
      payload: { email: 'f' }
    }
    expect(actions.editStudentField({"email":"f"})).toEqual(expected)
  })

})

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('copyVideoFile dispatches COPY_IN_PROGRESS and COPY_COMPLETE', (done) => {
    let shouldExist = path.join('.', 'public', 'videos', 'test-case', 'DF 1 - 2016-01-23.test')
    const expectedActions = [
      { type: types.COPY_IN_PROGRESS },
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

  it('fetchStudent creates RECIEVE_STUDENT after fetching students', (done) => {
    nock('http://localhost:5984')
      .get('/my-pouch-db/david-rose')
      .reply(200, { body: { _id: "david-rose", _rev: "1-2", name: "David Rose" }})

    const expectedActions = [
      { type: types.REQUEST_STUDENT },
      { type: types.RECIEVE_STUDENT, body: { _id: "david-rose", _rev: "1-2", name: "David Rose" } }
    ]

    const store = mockStore({ student: {} }, expectedActions, done())
    store.dispatch(actions.fetchStudent("david-rose"))
  })

  it('fetchStudents should return RECIEVE_STUDENTS and an array of docs', (done) => {
    nock('http://localhost:5984')
      .get('/my-pouch-db/_all_docs?include_docs=true')
      .reply(200, {
        body: {
          total_rows: 2,
          rows: [
            {_id: "david-rose", value: {"rev":"2-2"}, doc: {_id: "david-rose", name: "David Rose"}},
            {_id: "bob-hope", value: {"rev":"2-2"}, doc: {_id: "bob-hope", name: "Bob Hope"}}
          ]
        }
      })
    const expectedActions = [
      {
        type: types.REQUEST_STUDENTS
      },
      {
        type: types.RECIEVE_STUDENTS,
        payload: [
          {_id: "david-rose", name: "David Rose"},
          {_id: "bob-hope", name: "Bob Hope"}
        ]
      }
    ]
    const store = mockStore({ studentList: [] }, expectedActions, done())
    store.dispatch(actions.fetchStudents())
  })

})
