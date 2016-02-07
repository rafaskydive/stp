import moment from 'moment'
import uuid from 'uuid'

export default function jumpsTemplate(now, testUUID) {
  return {
    id: testUUID || uuid.v4(),
    jump_date: now,
    dive_flow: 1,
    jump_number: 3,
    instructor: "",
    notes: ""
  }
}
