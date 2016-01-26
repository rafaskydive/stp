import moment from 'moment'

const now = moment().format()

const jumpsTemplate = {}

jumpsTemplate[now] = {
  _id: now,
  date: now,
  dive_flow: 1,
  jump_number: 3,
  instructor: "",
  notes: ""
}

export default jumpsTemplate
