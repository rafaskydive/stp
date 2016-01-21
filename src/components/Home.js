import React, { Component } from 'react'
import { connect } from 'react-redux'
import { increase, decrease } from '../actions/count'

export default class Home extends Component {
  constructor (props) {
    super(props)
  }
  
  render () {
    return (
      <div>
        Home
      </div>
    )
  }
}
