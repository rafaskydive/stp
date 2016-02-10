import React from 'react'

export const HeaderButtons = props => (
  <div className="btn-group pull-right">
    <StudentListButton {...props}/>
    <ReportButton {...props}/>
    <SettingsButton {...props}/>
    <AuthInfo {...props}/>
  </div>
)

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
