import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import expect from 'expect'
import moment from 'moment'

import database from '../../src/database'
import { jumpsTemplate } from '../../src/utils'
import * as actions from '../../src/actions/video'
import * as types from '../../src/constants'

import fs from 'fs'
const mkdirp = require('mkdirp')

const ACTIONS = Object.keys(actions)

function markAsTested(action) {
  ACTIONS.splice(ACTIONS.indexOf(action), 1)
}

after(() => {
  console.log('UNTESTED ACTIONS (video)', ACTIONS)
})

describe('video actions', () => {
  describe('sync actions', () => {

  })

  /******************************************************************************/
  /* ASYNC ACTIONS                                                              */
  /******************************************************************************/

  const middlewares = [ thunk ]
  const mockStore = configureMockStore(middlewares)

  describe('async actions', () => {
    describe('copyVideoFile', () => {
      it('copies video while reporting progress, then returns the video file name via callback', (done) => {
        const state = {
          video: { files: [], copy_in_progress: false, percent: 0, video_file: null },
          student: { _id: 'test-student' },
          jump: { dive_flow: 1, jump_date: '2016-02-06 12:52:30' },
          file: { path: './test/mocks/copyVideoFileTest.txt' },
          settings: { videoFilePath: './test/output-data' }
        }
        const { video, student, jump, file, settings } = {...state}
        const expectedActions = [
          { type: types.COPY_PROGRESS, payload: {percent: 0}},
          { type: types.COPY_PROGRESS, payload: {percent: 100}},
          { type: types.COPY_COMPLETE, payload: 'test/output-data/test-student/DF 1 - 2016-02-06.txt' }
        ]
        const callback = (outfile) => {
          expect(fs.statSync(`test/output-data/test-student/${outfile}`).size).toEqual(fs.statSync(file.path).size)
          fs.unlinkSync(`test/output-data/test-student/${outfile}`)
          done()
        }
        const store = mockStore(video, expectedActions)
        store.dispatch(actions.copyVideoFile(student, jump, file, settings, callback, fs, mkdirp))
      })
      markAsTested('copyVideoFile')
    })
  })
})
