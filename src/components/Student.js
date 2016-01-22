import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../actions'

class Student extends Component {
  componentDidMount() {
    this.props.fetchStudent(this.props.params.id)
  }
  render() {
    let { student } = {...this.props}
    return (
      <div>
        <p><strong>_id:</strong> {student._id}</p>
        <p><strong>_rev:</strong> {student._rev}</p>
        <p><strong>name:</strong> {student.name}</p>
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
