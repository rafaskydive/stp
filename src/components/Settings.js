import React, { Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'

class SubmitButton extends Component {
  render() {
    return (
      <div className="form-actions padded">
        <button type="submit" className="btn btn-primary">
          <span className="icon icon-install icon-text"></span>
          Save Settings
        </button>
      </div>
    )
  }
}

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modified: false
    }
  }

  saveSettings(e) {
    e.preventDefault()
    const {settings} = {...this.props}
    this.props.saveSettings(JSON.stringify(settings), mkdirp, fs, storage)
    this.setState({modified: false})
  }

  changeValue(e) {
    this.setState({modified: true})
    this.props.changeSettingValue(e.target)
  }

  setModificationFlag(e) {
    const name = e.target.name
    const modObj = {}
    modObj[name] = true
    this.setState({modified: modObj})
  }

  render() {
    let submitButton = this.state.modified ? <SubmitButton/> : <div></div>
    let settings = {...this.props.settings}
    return (
      <div className="pane-group">
        <div className="pane">
          <header className="sub-header">
            <div className="toolbar-actions">
              <span className="page-title">Settings</span>
              <button className="btn btn-default pull-right" onClick={e => this.props.push('/')}>
                <span className="icon icon-home"></span>
              </button>
            </div>
          </header>
          <form onSubmit={e => this.saveSettings(e)}>
            <table className="settings-table table-striped">
              <thead>
                <tr>
                  <th width="15%">name</th>
                  <th>value</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(settings).map(key => {
                  let value = JSON.stringify(settings[key])
                  return (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>
                        <input
                          name={key}
                          defaultValue={value}
                          onChange={e => this.changeValue(e)}
                          className="form-control"
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {submitButton}
          </form>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { settings: state.settings }
}

const mapDispatchToProps = Object.assign({}, {
  push: routeActions.push,
  changeSettingValue: actionCreators.changeSettingValue,
  saveSettings: actionCreators.saveSettings
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
