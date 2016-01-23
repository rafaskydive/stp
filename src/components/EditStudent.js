import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as types from '../constants'
import * as actionCreators from '../actions'

class EditStudent extends Component {

  componentDidMount () {
    this.props.fetchStudent(this.props.params.id)
  }

  componentWillUnmount () {
    this.props.nullStudent()
  }

  handleSubmit(e) {
    e.preventDefault()
    if (!this.props.student.modified) {
      return {}
    }
    const _student = Object.assign({}, this.props.student, {
      name: this.refs.name.value,
      email: this.refs.email.value,
      phone: this.refs.phone.value
    })
    this.props.saveStudent(_student)
  }

  handleFormChange(e) {
    let field = {}
    field['modified'] = true
    field[`${e.target.name}`] = e.target.value
    this.props.editStudentField(field)
  }

  render () {
    let { student } = {...this.props}
    return (
      <div className="pane padded">
        <form>
          <div className="form-group">
            <label>Name</label>
            <input required value={student.name} onChange={(e) => this.handleFormChange(e)} className="form-control" type="text" name="name" ref="name" placeholder="Firstname Lastname"/>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input required value={student.email} onChange={(e) => this.handleFormChange(e)} className="form-control" type="email" name="email" ref="email" placeholder="email@example.com"/>
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input required value={student.phone} onChange={(e) => this.handleFormChange(e)} className="form-control" type="tel" name="phone" ref="phone" placeholder="123-456-7890"/>
          </div>
          {(() => {
            if(this.props.student.modified) {
              return (
                <button className="btn btn-form"
                  onClick={(e) => this.handleSubmit(e)}>
                  Save
                </button>
              )
            }
          })()}
        </form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { student: state.student }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {})

export default connect(mapStateToProps, mapDispatchToProps)(EditStudent)
