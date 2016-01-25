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

const now = moment().format()

describe('sync actions', () => {

  it('newStudent should return an object with new:true', () => {
    const jumpsTemplate = [
        {
          _id: `1-${now}`,
          dive_flow: 1,
          date: now,
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

  // it('saveStudent creates REQUEST_PUT_STUDENT, saves student, then creates fetchStudent stuff', (done) => {
  //
  //   const expectedActions = [
  //     { type: types.REQUEST_PUT_STUDENT },
  //     { type: types.REQUEST_STUDENT },
  //     { type: types.RECIEVE_STUDENT }
  //   ]
  //
  //   const newStudent = {
  //     type: 'student',
  //     name: `Test Student`,
  //     email: 'test@example.com',
  //     phone: '123-456-7890',
  //     jumps: [{
  //       _id: `1-${now}`,
  //       dive_flow: 1,
  //       date: now,
  //       instructor: "",
  //       notes: ""
  //     }]
  //   }
  //
  //   nock('http://localhost:5984', {"encodedQueryParams":true})
  //     .get('/my-pouch-db/')
  //     .reply(200, {"db_name":"my-pouch-db","doc_count":2,"doc_del_count":29,"update_seq":149,"purge_seq":0,"compact_running":false,"disk_size":602216,"data_size":11172,"instance_start_time":"1453465326747255","disk_format_version":6,"committed_update_seq":149}, { server: 'CouchDB/1.6.1 (Erlang OTP/17)',
  //     date: 'Mon, 25 Jan 2016 21:16:15 GMT',
  //     'content-type': 'application/json',
  //     'content-length': '243',
  //     'cache-control': 'must-revalidate' });
  //
  //   nock('http://localhost:5984', {"encodedQueryParams":true})
  //     .post('/my-pouch-db/_bulk_docs', {"docs":[{"type":"student","name":"Test Student","email":"test@example.com","phone":"123-456-7890","jumps":[{"_id":"1-2016-01-25T16:16:15-05:00","dive_flow":1,"date":"2016-01-25T16:16:15-05:00","instructor":"","notes":""}],"_id":"test-student"}],"new_edits":true})
  //     .reply(201, [{"ok":true,"id":"test-student","rev":"1-3a13612036133f3f195f8e9189b78bb3"}], { server: 'CouchDB/1.6.1 (Erlang OTP/17)',
  //     date: 'Mon, 25 Jan 2016 21:16:15 GMT',
  //     'content-type': 'application/json',
  //     'content-length': '77',
  //     'cache-control': 'must-revalidate' });
  //
  //   nock('http://localhost:5984', {"encodedQueryParams":true})
  //     .get('/my-pouch-db/test-student')
  //     .query(true)
  //     .reply(200, {"_id":"test-student","_rev":"1-3a13612036133f3f195f8e9189b78bb3","type":"student","name":"Test Student","email":"test@example.com","phone":"123-456-7890","jumps":[{"_id":"1-2016-01-25T16:16:15-05:00","dive_flow":1,"date":"2016-01-25T16:16:15-05:00","instructor":"","notes":""}]}, { server: 'CouchDB/1.6.1 (Erlang OTP/17)',
  //     etag: '"1-3a13612036133f3f195f8e9189b78bb3"',
  //     date: 'Mon, 25 Jan 2016 21:16:15 GMT',
  //     'content-type': 'application/json',
  //     'content-length': '280',
  //     'cache-control': 'must-revalidate' });
  //
  //   // nock('http://localhost:5984')
  //   //   .get('/my-couch-db/')
  //   //   .reply(200, {db_name:'my-couch-db'})
  //   //   .post('/my-couch-db/_bulk_docs', {docs: [newStudent]})
  //   //   .reply(201, [{ok:true,id:'test-student',rev:'1-1'}])
  //   //   .get('/my-couch-db/')
  //   //   .reply(200, {db_name:'my-couch-db'})
  //   //   .get('/my-couch-db/test-student')
  //   //   .query(true)
  //   //   .reply(200, {})
  //
  //   const store = mockStore({ student: {} }, expectedActions, done)
  //
  //   store.dispatch(actions.saveStudent(newStudent))
  //
  //   console.log('store:', store.getState())
  // })

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

})
