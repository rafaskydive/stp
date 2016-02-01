import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../actions'

class InstructorInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      instructors: [
        "",
        "David Rose",
        "James Englund",
        "Kevin Purdy"
      ]
    }
  }

  setInstructor(e) {
    this.props.onChange(e)
    this.props.setInstructorOnFirstJump(this.props.student, e.target.value)
    this.props.saveStudent(this.props.student)
  }

  render() {
    console.log(this.props)
    return(
      <select value={this.props.value}
        required
        onChange={e => this.setInstructor(e)}
        ref="instructor"
        name="instructor"
        type="text"
        placeholder="Instructor Name"
        className="form-control"
      >
      {this.state.instructors.map((instructor, i) => {
        return (
          <option value={instructor} key={i}>{instructor}</option>
        )
      })}
      </select>
    )
  }
}

function mapStateToProps(state) {
  return Object.assign({}, { student: state.student })
}

const mapDispatchToProps = Object.assign({}, {
  setInstructorOnFirstJump: actionCreators.setInstructorOnFirstJump,
  saveStudent: actionCreators.saveStudent
})

export default connect(mapStateToProps, mapDispatchToProps)(InstructorInput)
