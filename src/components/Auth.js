import React, { Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import * as actionCreators from '../actions/authActions'

class Auth extends Component {
  render () {
    return (
      <div className="window">
        <Header {...this.props}/>
        <Body {...this.props}/>
        <Footer {...this.props}/>
      </div>
    )
  }
}

const Body = ({auth, editField, login, location, push, replace}) => (
  <div className="window-content" style={{backgroundColor: '#333'}}>
    <div className="pane padded">
      <div style={{width: '37%', marginLeft: '33%', marginTop: 10,  borderRadius: 10}}>
        <form onSubmit={e =>{
          e.preventDefault()
          login(auth.user, (loggedIn) =>{
            if (location.state && location.state.nextPathName) {
              push(location.state.nextPathName)
            } else {
              push('/')
            }
          })
        }}>
          <div style={{padding: 10, backgroundColor: '#eee', borderBottom: '1px solid #ccc', borderRadius: '10px 10px 0px 0px'}}>
            <strong>
              { auth.error ? `${auth.error}` : "Please Log In"}
            </strong>
          </div>
          <div style={{padding: 10, backgroundColor: '#fff'}}>
            <div className="form-group">
              <label>Username</label>
              <input name="username" type="text" placeholder="username" className="form-control"
                value={auth.user.username}
                autoFocus={true}
                onChange={e => editField(e.target)}
                />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" placeholder="password" className="form-control"
                value={auth.user.password}
                onChange={e => editField(e.target)}
                />
            </div>
          </div>
          <div style={{padding: 10, backgroundColor: '#eee', borderTop: '1px solid #ccc', borderRadius: '0px 0px 10px 10px'}}>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                <span className="icon icon-login icon-text"></span>
                Log In
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
)

const Header = props => (
  <header className="toolbar toolbar-header">
    <Toolbar {...props}/>
  </header>
)

const Toolbar = ({push}) => (
  <div className="toolbar-actions text-center">
    <span className="page-title">Authenticate</span>
    <button className="btn btn-default pull-left"
      onClick={() => push("/")}>
      <span className="icon icon-home"></span>
    </button>
  </div>
)

const Footer = props => (
  <footer className="toolbar toolbar-footer">
  </footer>
)

function mapStateToProps(state) {
  return { auth: state.auth }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {
  push: routeActions.push,
  replace: routeActions.replace
})

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
