import React, { Component } from 'react'

export default class ErrorStatus extends Component {
  render() {
    if(! this.props.errors || this.props.errors.length === 0) return ( <span></span> )
    return (
      <span className='error'>
        <span className="error-title">Error: </span>
        {this.props.errors.map((error, i) => {
          return <span key={i}>{error}. </span>
        })}
      </span>
    )
  }
}
