import React, { Component } from 'react'

class Foo extends Component {
  render() {
    console.log("Foo Props:", this.props)
    return (
      <div>
        FOO {this.props.params.id}
      </div>
    )
  }
}

export default Foo
