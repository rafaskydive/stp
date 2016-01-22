import React, { Component } from 'react'
import { connect } from 'react-redux'
import { selectStudent } from '../actions'

class StudentList extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    let studentList = this.props.state.studentList
    return (
      <div>
        <table className="table-striped">
          <thead>
            <tr>
              <th>_id</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {studentList.students.map(student => {
              return (
                <tr key={student._id} onClick={e => this.props.dispatch(selectStudent(student._id))}>
                  <th>{student._id}</th>
                  <th>{student.name}</th>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p><strong>Student: </strong>
          {studentList.selectedStudent !== null ? studentList.selectedStudent.name : 'null'}
        </p>
      </div>
    )
  }
}

function select(state) {
  // return {
  //   students: state.studentList.students,
  //   selectedStudent: state.studentList.selectedStudent,
  //   selectStudent: selectStudent
  // }
  return {
    state: state
  }
}
export default connect(select)(StudentList)
