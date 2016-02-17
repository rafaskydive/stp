import React from 'react'

export const HeaderButtons = props => {
  const reportButton   = props.auth.loggedIn ? <ReportButton   {...props}/> : ""
  const settingsButton = props.auth.loggedIn ? <SettingsButton {...props}/> : ""
  const newUserButton  = props.auth.loggedIn ? <NewUserButton  {...props}/> : ""

  return (
    <div className="btn-group pull-right">
      <StudentListButton {...props}/>
      { reportButton }
      { settingsButton }
      { newUserButton }
      <AuthInfo {...props}/>
    </div>
  )
}

const StudentListButton = ({push, location}) => (
  <button className={`btn btn-default ${location.pathname === '/' ? "active" : ""}`} onClick={() => push('/')}>
    <span className="icon icon-list icon-text"></span>
    Student List
  </button>
)

const AuthInfo = ({auth, push, logout, location}) => {
  if (auth.loggedIn) {
    return (
      <button className={`btn btn-default ${location.pathname === '/login' ? "active" : ""}`} onClick={() => logout()}>
        <span className="icon icon-logout icon-text"></span>
        Log Out {auth.loggedIn}
      </button>
    )
  }
  return (
    <button className={`btn btn-default ${location.pathname === '/login' ? "active" : ""}`} onClick={() => push('/login')}>
      <span className="icon icon-login icon-text"></span>
      Log In
    </button>
  )
}

export const SettingsButton = ({push, location}) => (
  <button className={`btn btn-default ${location.pathname === '/settings' ? "active" : ""}`} onClick={() => push('/settings')}>
    <span className="icon icon-cog icon-text"></span>
    Settings
  </button>
)

export const ReportButton = ({push, location}) => (
  <button className={`btn btn-default ${location.pathname === '/report' ? "active" : ""}`} onClick={() => push('/report')}>
    <span className="icon icon-newspaper icon-text"></span>
    Report
  </button>
)

export const NewUserButton = ({push, location}) => (
  <button className={`btn btn-default ${location.pathname === '/new_user' ? "active" : ""}`} onClick={() => push('/new_user')}>
    <span className="icon icon-user-add icon-text"></span>
    New User
  </button>
)
