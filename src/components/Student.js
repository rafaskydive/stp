import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../actions'

class Student extends Component {
  componentDidMount() {
    this.props.fetchStudent(this.props.params.id)
  }

  handleEditStudentButtonClick (_id) {
    window.location.hash = `#/student/${_id}/edit`
  }

  render() {
    let { student } = {...this.props}
    return (
      <div>
        <div className="student-header padded" onClick={() => this.handleEditStudentButtonClick(student._id)}>
          <div className="pane-group">
            <div className="pane-one-fourth">
              Name: <strong>{student.name}</strong>
            </div>
            <div className="pane-one-fourth">
              Email: <strong>{student.email}</strong>
            </div>
            <div className="pane-one-fourth">
              Phone: <strong>{student.phone}</strong>
            </div>
            <div className="pane-one-fourth">
            </div>
          </div>
        </div>
        <div>
          <h1>World</h1>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { student: state.student }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {

})
export default connect(mapStateToProps, mapDispatchToProps)(Student)
