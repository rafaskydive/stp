import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../actions'

class Settings extends Component {
  render() {
    console.log('Settings props:', this.props)
    return <h1>Settings</h1>
  }
}

function mapStateToProps(state) {
  return { config: state.config }
}

const mapDispatchToProps = Object.assign({}, {

})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
