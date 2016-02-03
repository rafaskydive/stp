import React, { Component } from 'react'

export default class ConditionalInput extends Component {
  render() {
    let { label } = {...this.props}
    return this.props.disabled ?
    (
      <div className="conditional-input">{label}: <strong className="pull-right">{this.props.value}</strong></div>
    ) :
    (
      <div className="form-group">
        <label>{label}</label>
        <input {...this.props}/>
      </div>
    )
  }
}
