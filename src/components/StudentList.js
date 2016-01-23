import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'

class StudentList extends Component {
  componentWillMount() {
    this.props.fetchStudents()
  }

  render () {
    let { studentList, push } = {...this.props}
    return (
      <div>
        <table className="table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {studentList.students.map(student => {
              return (
                <tr key={student._id} onClick={e => push(`/student/${student._id}`)}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { studentList: state.studentList }
}

const mapDispatchToProps = {
  push: routeActions.push,
  fetchStudents: actionCreators.fetchStudents
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentList)
