const path = require('path')

function home() {
  return process.env['HOME'] || HOME
}
export default {
  "videoFilePath": path.join(home(), '.stp', 'videos')
}
