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
        <h1>{student.name}</h1>
        <p>{student.email}</p>
        <p>{student.phone}</p>
        <div className="btn-group">
          <div className="btn btn-form"
            onClick={() => this.handleEditStudentButtonClick(student._id)}>
            <span className="icon icon-user icon-text"></span>
            Edit
          </div>
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
