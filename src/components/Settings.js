import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
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

class DropzoneElement extends Component {
  onDrop(files) {
    this.props.changeSettingValue({name: 'videoFilePath', value: files[0].path})
  }

  render () {
    return (
      <Dropzone
        className="inline-dropzone"
        multiple={false}
        onDrop={(files) => this.onDrop(files)}
        >
        <div className="drop-zone-text">
          Drag Folder Here To Set
        </div>
      </Dropzone>
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

  inputEl(key, value) {
    if(key === "videoFilePath") {
      return (
        <span>{value}</span>
      )
    }
    return (
      <input
        name={key}
        defaultValue={value}
        onChange={e => this.changeValue(e)}
        className="form-control"
      />
    )
  }
  render() {
    // let submitButton = this.state.modified ? <SubmitButton/> : <div></div>
    let submitButton = <SubmitButton/>
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
                  let dropzoneElementContent = key === "videoFilePath" ? <DropzoneElement changeSettingValue={this.props.changeSettingValue} changeValue={this.props.changeValue}/> : ""
                  let value = JSON.stringify(settings[key])
                  return (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>
                        {this.inputEl(key, value)}
                        <span className="pull-right">{dropzoneElementContent}</span>
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
