import moment from 'moment'

export default function jumpsTemplate(now) {
  return {
    jump_date: now,
    dive_flow: 1,
    jump_number: 3,
    instructor: "",
    notes: ""
  }
}
