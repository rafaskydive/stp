import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../actions'

class NewStudent extends Component {
  handleSubmit(e) {
    e.preventDefault()
    const student = {
      name: this.refs.name.value
    }
    console.log(student);
  }

  render () {
    console.log('NewStudent props:', this.props)
    let { student } = {...this.props}
    return (
      <form>
        <div className="form-group">
          <label>Name</label>
          <input className="form-control" type="text" ref="name" placeholder="Firstname Lastname"/>
        </div>
        <div className="form-group">
          <label>Email</label>
          <input className="form-control" type="email" ref="email" placeholder="email@example.com"/>
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input className="form-control" type="phone" ref="phone" placeholder="123-456-7890"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewStudent)
