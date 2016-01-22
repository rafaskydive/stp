import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'

class StudentList extends Component {
  componentDidMount() {
    this.props.fetchStudents()
  }

  render () {
    let { studentList, push } = {...this.props}
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
                <tr key={student._id} onClick={e => push(`/student/${student._id}`)}>
                  <th>{student._id}</th>
                  <th>{student.name}</th>
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

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actionCreators, dispatch)
  }
}

const mapDispatchToProps2 = Object.assign({}, actionCreators, {
  push: routeActions.push
})
export default connect(mapStateToProps, mapDispatchToProps2)(StudentList)
