import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../actions'

class Student extends Component {
  componentWillMount() {
    this.props.fetchStudent(this.props.params.id)
  }

  handleEditStudentButtonClick (_id) {
    window.location.hash = `#/student/${_id}/edit`
  }

  render() {
    let { student } = {...this.props}
    return (
      <div>
        <div className="student-header padded">
          <div className="pane-group">
            <div className="pane-one-fourth">
              Name: <strong onClick={() => this.handleEditStudentButtonClick(student._id)}>{student.name}</strong>
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
          <ul className="list-group">
            { student.jumps.map((jump, i) => {
              return (
                <li className="list-group-item" key={i}>
                  <div className="media-body">
                    <strong>Dive Flow {jump.dive_flow}</strong>
                    <p>Date: </p>
                  </div>
                </li>
              )
            })}
          </ul>
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
