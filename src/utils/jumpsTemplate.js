import moment from 'moment'

export default function jumpsTemplate(now) {
  const jump = {
    _id: now,
    _date: now,
    dive_flow: 1,
    jump_number: 3,
    instructor: "",
    notes: ""
  }
  const obj = {}
  obj[`${now}`] = jump
  return obj
}
