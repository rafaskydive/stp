import * as types from '../constants'
import moment from 'moment'
const path = require('path')

function copying() {
  return {
    type: types.COPY_IN_PROGRESS
  }
}

function complete(dest) {
  return {
    type: types.COPY_COMPLETE,
    payload: dest
  }
}

export function copyVideoFile(student, jump, file, _fs=fs, cb) {
  return dispatch => {
    dispatch(copying())
    let ext = path.extname(file.path)
    let outfile = `DF ${jump.dive_flow} - ${moment(jump.date).format('YYYY-MM-DD')}${ext}`
    let dest = path.join('.', 'public', 'videos', student._id, outfile)
    _fs.copy(file.path, dest, (err) => {
      if (err) return console.log(err)
      dispatch(complete(dest))
    })
  }
}
