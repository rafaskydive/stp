import * as types from '../constants'
import moment from 'moment'
import progress from 'progress-stream'
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

// TODO: look in to https://www.npmjs.com/package/progress-stream

export function copyVideoFile(student, jump, file, _fs=fs, cb) {
  return dispatch => {
    dispatch(copying())
    let ext = path.extname(file.path)
    let outfile = `DF ${jump.dive_flow} - ${moment(jump.date).format('YYYY-MM-DD')}${ext}`
    let outdir = path.join('.', 'public', 'videos', student._id)
    let dest = path.join(outdir, outfile)
    let stat = _fs.statSync(file.path)

    console.log('stat', stat)

    const str = progress({
      length: stat.size,
      time: 100
    })
    str.on('progress', (progress) => {
      console.log(progress)
    })
    const rd = _fs.createReadStream(file.path)
    const wr = _fs.createWriteStream(dest);

    _fs.mkdir(outdir, (err) => {
      if (err) { console.log('mkdir err:', err) }
      // rd.pipe(str).pipe(wr)
      rd.pipe(wr)
    })

    // _fs.copy(file.path, dest, (err) => {
    //   if (err) return console.log(err)
    //   dispatch(complete(dest))
    // })

  }
}
