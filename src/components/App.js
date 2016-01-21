// const React = require('react');
import React, { Component } from 'react'
const { Link } = require('react-router');
const { connect } = require('react-redux');
const { routeActions } = require('redux-simple-router');

class App extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className="window">
        <header className="toolbar toolbar-header">
          <div className="toolbar-actions">
            <div className="btn-group">
              <div className="btn btn-default">
                <span className="icon icon-left"
                  onClick={() => this.props.dispatch(routeActions.goBack())}
                ></span>
              </div>
              <div className="btn btn-default">
                <span className="icon icon-right"
                  onClick={() => this.props.dispatch(routeActions.goForward())}
                ></span>
              </div>
            </div>

            <div className="btn-group">
              <div className="btn btn-default">
                <span className="icon icon-home"
                  onClick={() => this.props.dispatch(routeActions.push('/'))}
                ></span>
              </div>
            </div>

            <div className="btn-group">
              <div className="btn btn-default">
                <span className="icon icon-home"
                  onClick={() => this.props.dispatch(routeActions.push('/foo'))}
                ></span>
              </div>
              <div className="btn btn-default">
                <span className="icon icon-home"
                  onClick={() => this.props.dispatch(routeActions.push('/bar'))}
                ></span>
              </div>
            </div>

          </div>
        </header>
        <div className="window-content">
          <div className="pane padded">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
};

function select(state) {
  return state
}

export default connect(select)(App)
