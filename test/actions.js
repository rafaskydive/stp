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

describe('sync actions', () => {

  it('newStudent should return an object with new:true', () => {
    const payload = {
      new: true,
      type: 'student',
      jumps: jumpsTemplate
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
  afterEach(() => {
    nock.cleanAll()
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

  it('fetchStudent creates RECIEVE_STUDENT after fetching students', (done) => {
    nock('http://localhost:5984')
      .get('/my-pouch-db/')
      .reply(200, {db_name:'my-pouch-db'})
      .get('/my-pouch-db/david-rose')
      .query(true)
      .reply(200, { "_id": "david-rose", "_rev": "1-2", "name": "David Rose" })

    const expectedActions = [
      { type: types.REQUEST_STUDENT },
      { type: types.RECIEVE_STUDENT, payload: { _id: "david-rose", _rev: "1-2", name: "David Rose" } }
    ]

    const store = mockStore({ student: {} }, expectedActions, done)
    store.dispatch(actions.fetchStudent("david-rose"))
  })

  it('fetchStudents should return RECIEVE_STUDENTS and an array of docs', (done) => {
    nock('http://localhost:5984')
      .get('/my-pouch-db/')
      .reply(200,{db_name:"my-pouch-db"})
      .get('/my-pouch-db/_design/app/_view/by_name')
      .query({include_docs:true})
      .reply(200, {
        total_rows: 2,
        offset: 0,
        rows: [
          {_id: "david-rose", value: null, doc: {_id: "david-rose", name: "David Rose"}},
          {_id: "bob-hope", value: null, doc: {_id: "bob-hope", name: "Bob Hope"}}
        ]
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
    const store = mockStore({ studentList: [] }, expectedActions, done)
    store.dispatch(actions.fetchStudents())
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
      {
        type: types.RECIEVE_STUDENT,
        payload: Object.assign({}, newStudent, {
          _id: "test-student",
          _rev: "1-3a13612036133f3f195f8e9189b78bb3"
        })
      }
    ]

    nock('http://localhost:5984', {"encodedQueryParams":true})
      .get('/my-pouch-db/')
      .reply(200, {"db_name":"my-pouch-db"})

    nock('http://localhost:5984', {"encodedQueryParams":true})
      .post('/my-pouch-db/_bulk_docs', {
        "docs":[
          {
            "type":"student",
            "name":"Test Student",
            "email":"test@example.com",
            "phone":"123-456-7890",
            "jumps":[
              {
                "_id":`1-${now}`,
                "dive_flow":1,
                "date": now,
                "instructor":"",
                "notes":""
              }
            ],
            "_id":"test-student"}
          ],
          "new_edits":true
        }
      )
      .reply(201, [{"ok":true,"id":"test-student","rev":"1-3a13612036133f3f195f8e9189b78bb3"}])

    nock('http://localhost:5984', {"encodedQueryParams":true})
      .get('/my-pouch-db/test-student')
      .query(true)
      .reply(200, {
        "_id":"test-student",
        "_rev":"1-3a13612036133f3f195f8e9189b78bb3",
        "type":"student",
        "name":"Test Student",
        "email":"test@example.com",
        "phone":"123-456-7890",
        "jumps":[
          {
            "_id":`1-${now}`,
            "dive_flow":1,
            "date":now,
            "instructor":"",
            "notes":""
          }
        ]
      })

    const store = mockStore({ student: newStudent }, expectedActions, done)

    store.dispatch(actions.saveStudent(newStudent))

    // console.log('store:', store.getState())
  })

})
