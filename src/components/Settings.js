const path = require('path')

import React, { Component } from 'react'
import { HeaderButtons } from './HeaderButtons'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'
import { routeActions, push } from 'react-router-redux'
import * as actionCreators from '../actions'

class Settings extends Component {
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

const Header = props => (
  <header className="toolbar toolbar-header">
    <Toolbar {...props}/>
  </header>
)

const Toolbar = props => (
  <div className="toolbar-actions text-center">
    <HeaderButtons {...props}/>
  </div>
)

const Body = ({settings, changeSettingValue, saveSettings, cancelSaveSettings}) => {
  let { configuration } = {...settings}
  const SubmitButton = settings.modified ? renderSubmitButton : () => (<div></div>)
  return (
    <div className="window-content">
      <div className="pane">
        <form onSubmit={e => {
            e.preventDefault()
            saveSettings(JSON.stringify(configuration), mkdirp, fs, storage)
          }}>
          <table className="table-striped">
            <thead>
              <tr>
                <th width="15%">Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              { renderTableRows(configuration, changeSettingValue) }
            </tbody>
          </table>
          { SubmitButton(cancelSaveSettings) }
        </form>
      </div>
    </div>
  )
}

const renderTableRows = (configuration, changeSettingValue) => (
  Object.keys(configuration).map(name => renderTableRow(name, configuration[name], changeSettingValue))
)

const renderTableRow = (name, value, changeSettingValue) => {
  let JSONvalue = JSON.stringify(value)
  let dropzoneElementContent = name === "videoFilePath" ? <DropzoneElement changeSettingValue={changeSettingValue}/> : ""

  return (
    <tr key={name}>
      <td>{name}</td>
      <td>
        { inputElement(name, JSONvalue, changeSettingValue) }
        { dropzoneElementContent }
      </td>
    </tr>
  )
}

const inputElement = (name, JSONvalue, changeSettingValue) => {
  if (name === "videoFilePath") { return <span>{JSONvalue}</span>}
  return (
    <input name={name} defaultValue={JSONvalue} onChange={e => changeSettingValue(e.target)} className="form-control"/>
  )
}

const DropzoneElement = ({changeSettingValue}) => (
  <Dropzone
    className="inline-dropzone pull-right"
    multiple={false}
    onDrop={(files) => changeSettingValue({ name: 'videoFilePath', value: files[0].path }) }>
    <div className="drop-zone-text">
      Drop Folder Here to Set
    </div>
  </Dropzone>
)

const renderSubmitButton = (cancelSaveSettings) => (
  <div className="form-actions padded">
    <button type="submit" className="btn btn-primary">
      <span className="icon icon-install icon-text"></span>
      Save Settings
    </button>
    <button className="btn btn-default" onClick={() => cancelSaveSettings()}>
      <span className="icon icon-ccw icon-text"></span>
      Cancel
    </button>
  </div>
)

const OpenSettingsButton = props => (
  <button className="btn btn-default"
    onClick={e => {
      e.preventDefault();
      shell.openItem(path.join(storage.userConfig(), 'settings.json'))
    }}
    >
    Open settings.json
  </button>
)

const Footer = props => (
  <footer className="toolbar toolbar-footer">
    <div className="toolbar-actions">
      <OpenSettingsButton/>
    </div>
  </footer>
)

function mapStateToProps(state) {
  return { settings: state.settings, auth: state.auth }
}

const mapDispatchToProps = Object.assign({}, {
  push: push,
  changeSettingValue: actionCreators.changeSettingValue,
  cancelSaveSettings: actionCreators.cancelSaveSettings,
  saveSettings: actionCreators.saveSettings,
  logout: actionCreators.logout
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
