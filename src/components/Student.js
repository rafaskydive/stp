import React, { Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
import moment from 'moment'

class Student extends Component {

  render() {
    return (
      this.props.children
    )
  }
}

function mapStateToProps(state) {
  return { state: state }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {
})
export default connect(mapStateToProps, mapDispatchToProps)(Student)
