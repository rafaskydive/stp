import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../actions'

class EditStudent extends Component {
  handleSubmit(e) {
    e.preventDefault()
    const student = {
      name: this.refs.name.value,
      email: this.refs.email.value,
      phone: this.refs.phone.value
    }
    console.log(student);
  }

  handleFormChange(e) {
    let foo = {}
    foo[`${e.target.name}`] = e.target.value
    console.log(foo)
  }
  render () {
    console.log('EditStudent props:', this.props)
    let { student } = {...this.props}
    return (
      <form>
        <div className="form-group">
          <label>Name</label>
          <input value={student.name} onChange={(e) => this.handleFormChange(e)} className="form-control" type="text" name="name" ref="name" placeholder="Firstname Lastname"/>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input value={student.email} onChange={(e) => this.handleFormChange(e)} className="form-control" type="email" name="email" ref="email" placeholder="email@example.com"/>
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input value={student.phone} onChange={(e) => this.handleFormChange(e)} className="form-control" type="phone" name="phone" ref="phone" placeholder="123-456-7890"/>
        </div>
        <button className="btn btn-form"
          onClick={(e) => this.handleSubmit(e)}>
          Create New Student
        </button>
      </form>
    )
  }
}

function mapStateToProps(state) {
  return { student: state.student }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {})

export default connect(mapStateToProps, mapDispatchToProps)(EditStudent)
