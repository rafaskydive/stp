import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../actions'

class InstructorInput extends Component {

  componentDidMount() {
    if(!this.props.instructors.length > 0) {
      this.props.requestInstructorOptions()
    }
  }

  setInstructor(e) {
    this.props.onChange(e)
    if (this.props.student.jumps.length === 1) {
      this.props.setInstructorOnFirstJump(this.props.student, e.target.value)
    }
  }

  render() {
    let { label } = {...this.props}
    return this.props.disabled && !this.props.unconditional ?
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
          <option value="" key=""></option>
        {this.props.instructors.map((instructor, i) => {
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
  return Object.assign({}, { student: state.student, settings: state.settings, instructors: state.instructors })
}

const mapDispatchToProps = Object.assign({}, {
  requestInstructorOptions: actionCreators.requestInstructorOptions,
  setInstructorOnFirstJump: actionCreators.setInstructorOnFirstJump,
  saveStudent: actionCreators.saveStudent
})

export default connect(mapStateToProps, mapDispatchToProps)(InstructorInput)
