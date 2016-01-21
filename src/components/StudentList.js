import React, { Component } from 'react'
import { connect } from 'react-redux'

class StudentList extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    console.log("StudentList Props:", this.props)
    return (
      <table className="table-striped">
        <thead>
          <tr>
            <th>_id</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {this.props.students.map(student => {
            return (
              <tr key={student._id}>
                <th>{student._id}</th>
                <th>{student.name}</th>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}

function select(state) {
  return {
    students: state.studentList.students
  }
}
export default connect(select)(StudentList)
