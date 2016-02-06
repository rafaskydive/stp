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

function copy_progress(percent) {
  return {
    type: types.COPY_PROGRESS,
    payload: { percent: percent }
  }
}

export function copyVideoFile(student, jump, file, settings, callback, _fs=fs, _mkdirp=mkdirp) {
  return dispatch => {
    if(!settings.videoFilePath) {
      return dispatch({
        type: types.SAVE_STUDENT_ERROR,
        payload: { errors: ["videoFilePath must be set in Settings"]}
      })
    }
    let start = moment().unix()

    dispatch(copying())
    let ext = path.extname(file.path)
    let outfile = `DF ${jump.dive_flow} - ${moment(jump.jump_date).format('YYYY-MM-DD')}${ext}`
    let outdir = path.join(settings.videoFilePath, student._id)

    _mkdirp(outdir, (err) => {
      if (err) {
        console.log('mkdirp err:', err)
      }
      let dest = path.join(outdir, outfile)
      let stat = _fs.statSync(file.path)
      const streamOpts = {highWaterMark: Math.pow(2,24)}
      const rd = _fs.createReadStream(file.path, streamOpts)
      const wr = _fs.createWriteStream(dest, streamOpts);

      let count = 0

      rd.on('data', (data) => {
        count += data.length
        let percent = Math.round(count/stat.size*100)
        if ( percent % 5 === 0 ) {
          dispatch(copy_progress(percent))
        }
      })

      rd.on('end', () => {
        let end = moment().unix()
        let duration = end - start
        dispatch(complete(dest))
        callback(outfile)
      })

      rd.pipe(wr)
    })
  }
}
