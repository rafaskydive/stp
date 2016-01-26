import * as types from '../constants'
import moment from 'moment'
const path = require('path')

function copying() {
  return {
    type: types.COPY_PROGRESS,
    payload: { percent: 0 }
  }
}

function complete(dest) {
  return {
    type: types.COPY_COMPLETE,
    payload: dest
  }
}

function progress(percent) {
  return {
    type: types.COPY_PROGRESS,
    payload: { percent: percent}
  }
}
// TODO: look in to https://www.npmjs.com/package/progress-stream

export function copyVideoFile(student, jump, file, _fs=fs, cb) {
  return dispatch => {
    dispatch(copying())
    let ext = path.extname(file.path)
    let outfile = `DF ${jump.dive_flow} - ${moment(jump.date).format('YYYY-MM-DD')}${ext}`
    let outdir = path.join('.', 'public', 'videos', student._id)
    let dest = path.join(outdir, outfile)
    let stat = _fs.statSync(file.path)

    const rd = _fs.createReadStream(file.path)
    const wr = _fs.createWriteStream(dest);

    let count = 0
    _fs.mkdir(outdir, (err) => {
      if (err) { console.log('mkdir err:', err) }

      rd.on('data', (data) => {
        count += data.length
        let percent = Math.round(count/stat.size*100)
        if ( percent % 5 === 0 ) {
          dispatch(progress(percent))
        }
      })

      rd.on('close', () => {
        dispatch(complete(dest))
      })

      rd.pipe(wr)
    })

  }
}
