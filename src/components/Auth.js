import React, { Component } from 'react'
import { connect } from 'react-redux'
import { routeActions, push, replace } from 'react-router-redux'
import * as actionCreators from '../actions/authActions'

class Auth extends Component {
  render () {
    return (
      <div className="window">
        <Body {...this.props} newUser={this.props.location.pathname === '/new_user'}/>
      </div>
    )
  }
}

const handleLogin = (e, user, login, push) => {
  e.preventDefault()
  login(user, (loggedIn) => {
    if (location.state && location.state.nextPathName) {
      push(location.state.nextPathName)
    } else {
      push('/')
    }
  })
}

const Body = ({auth, editField, login, createNewUser, location, push, replace}) => {
  let FormButtons, headerMessage, loginFunction
  if (location.pathname === '/new_user') {
    FormButtons = NewUserButtons
    headerMessage = "Create New User"
    loginFunction = createNewUser
  } else {
    FormButtons = RegularButtons
    headerMessage = "Please Log In"
    loginFunction = login
  }
  return (
    <div className="window-content" style={{backgroundColor: '#333'}}>
      <div className="pane padded">
        <div style={{width: '37%', marginLeft: '33%', marginTop: 10,  borderRadius: 10}}>
          <form onSubmit={e => handleLogin(e, auth.user, loginFunction, push)}>
            <div style={{padding: 10, backgroundColor: '#eee', borderBottom: '1px solid #ccc', borderRadius: '10px 10px 0px 0px'}}>
              <strong>
                { auth.error ? `${auth.error}` : headerMessage}
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
              <FormButtons push={push}/>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const Header = props => (
  <header className="toolbar toolbar-header">
    <Toolbar {...props}/>
  </header>
)

const Toolbar = ({push}) => (
  <div className="toolbar-actions text-center">
  </div>
)

const RegularButtons = ({push}) => (
  <div className="form-actions">
    <button type="submit" className="btn btn-primary">
      <span className="icon icon-login icon-text" style={{color: 'white'}}></span>
      Log In
    </button>
    <button className="btn btn-default" onClick={() => push('/')}>
      <span className="icon icon-ccw icon-text"></span>
      Cancel
    </button>
  </div>
)

const NewUserButtons = ({push}) => (
  <div className="form-actions">
    <button type="submit" className="btn btn-primary">
      <span className="icon icon-user-add icon-text" style={{color: 'white'}}></span>
      Create New User
    </button>
    <button className="btn btn-default" onClick={() => push('/')}>
      <span className="icon icon-ccw icon-text"></span>
      Cancel
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
  push: push,
  replace: replace
})

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
