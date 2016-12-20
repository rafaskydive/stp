import createStudents from './createStudents'
import createLogEntryOptions from './createLogEntryOptions'
import createDzOptions from './createDzOptions'

export default function (database, runningInTestMode) {
  createStudents(database, runningInTestMode)
  createLogEntryOptions(database, runningInTestMode)
  createDzOptions(database, runningInTestMode)
}
