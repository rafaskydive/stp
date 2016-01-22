import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
// import { selectStudent } from '../actions'

class StudentList extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    console.log('StudentList props:', this.props)
    let { studentList, selectStudent, push } = {...this.props}
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
                <tr key={student._id} onClick={e => selectStudent(student._id)}>
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
        <div>
          <button className="btn btn-default">
            <Link to="/foo/123">/foo</Link>
          </button>
          <button
            className="btn btn-default"
            onClick={() => push("/bar")}
            >
            /bar
          </button>
        </div>
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
