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
    if (this.props.student.jumps.length === 1) {
      this.props.setInstructorOnFirstJump(this.props.student, e.target.value)
      this.props.saveStudent(this.props.student)
    }
  }

  render() {
    let { label } = {...this.props}
    return this.props.disabled ?
    (
      <div className="conditional-input">{label}<br/>{this.props.value}</div>
    ) :
    (
      <div className="form-group">
        <label>{label}</label>
        <select value={this.props.value}
          required
          disabled={this.props.disabled}
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
      </div>
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