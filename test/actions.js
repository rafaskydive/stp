import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import expect from 'expect'
import * as actions from '../src/actions'
import * as types from '../src/constants'
import { jumpsTemplate } from '../src/database'

describe('sync actions', () => {

  it('newStudent should return an object with new:true', () => {
    const payload = {
      new: true,
      type: 'student',
      jumps: jumpsTemplate()
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
