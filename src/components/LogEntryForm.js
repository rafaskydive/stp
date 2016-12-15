import React, { Component } from 'react'
import { EnableFormButton, SaveAndCancelButtons } from './form-buttons'
import moment from 'moment'
import { Creatable } from 'react-select'

export default class LogEntryForm extends Component {
  componentDidMount () {
    // "exit" is just one of the logEntryOptions
    // if it's not present, we haven't loaded the options
    // from the database
    if (!this.props.logEntryOptions.exit) {
      this.props.requestLogEntryOptions()
    }
  }
  render () {
    return (
      <div className="padded">
        <Form {...this.props}/>
      </div>
    )
  }
}

const Form = ({student, jump, editJumpField, disableStudentEditForm, enableStudentEditForm, saveStudent, logEntryOptions}) => (
  <form onSubmit={e => {
    e.preventDefault()
    return student.modified ? saveStudent(student) : {}
    }}>
    <div className="form-group form-group-small">
      <label>Equipment</label>
      <select name="equipment" className="form-control"
        value={jump.equipment}
        disabled={!student.modified}
        onChange={e => editJumpField(student, jump, e.target.name, e.target.value)}
      >{EquipmentOptions()}</select>
    </div>
    <div className="form-group form-group-small">
      <label>Exit Altitude</label>
      <select name="exit_altitude" className="form-control"
        value={jump.exit_altitude}
        disabled={!student.modified}
        onChange={e => editJumpField(student, jump, e.target.name, e.target.value)}
      >{ExitAltitudeOptions()}</select>
    </div>
    <div className="form-group form-group-small">
      <label>Deployment Altitude</label>
      <select name="deployment_altitude" className="form-control"
        value={jump.deployment_altitude}
        disabled={!student.modified}
        onChange={e => editJumpField(student, jump, e.target.name, e.target.value)}
      >{DeploymentAltitudeOptions()}</select>
    </div>
    <div className="form-group form-group-small">
      <label>Delay</label>
      <input disabled={true} value={delay(jump)}/>
    </div>

    <div className="form-group">
      <label>Exit</label>
      <Creatable name="exit"
        value={jump.exit}
        multi={true}
        disabled={!student.modified}
        options={logEntryOptions.exit}
        onChange={val => editJumpField(student, jump, "exit", val)}/>
    </div>
    <div className="form-group">
      <label>Maneuvers</label>
      <Creatable name="maneuvers"
        value={jump.maneuvers}
        multi={true}
        disabled={!student.modified}
        options={logEntryOptions.maneuvers}
        onChange={val => editJumpField(student, jump, "maneuvers", val)}/>
    </div>
    <div className="form-group">
      <label>Canopy Control</label>
      <Creatable name="canopy_control"
        value={jump.canopy_control}
        multi={true}
        disabled={!student.modified}
        options={logEntryOptions.canopy}
        onChange={val => editJumpField(student, jump, "canopy_control", val)}/>
    </div>
    <div className="form-group">
      <label>Landing</label>
      <Creatable name="landing"
        value={jump.landing}
        multi={true}
        disabled={!student.modified}
        options={logEntryOptions.landing}
        onChange={val => editJumpField(student, jump, "landing", val)}/>
    </div>
    <div className="form-group">
      <label>Improvement Points</label>
      <Creatable name="improvement_points"
        value={jump.improvement_points}
        multi={true}
        disabled={!student.modified}
        options={logEntryOptions.improvement_points}
        onChange={val => editJumpField(student, jump, "improvement_points", val)}/>
    </div>
    {/*(
      student.modified ?
      <SaveAndCancelButtons student={student} disableStudentEditForm={disableStudentEditForm}/> :
      <EnableFormButton enableStudentEditForm={enableStudentEditForm}/>
    )*/}
  </form>
)

const EquipmentOptions = () => (
  ['',150,170,190,210,230,260,280,300].map((canopy, i) => EquipmentOption(canopy, i))
)

const EquipmentOption = (canopy, i) => (
  <option key={i} value={canopy}>{canopy}</option>
)

const ExitAltitudeOptions = () => {
  let altitudes = []
  for(let x = 9000; x <= 15000; x += 500) {
    altitudes.push(x)
  }
  return [<option key='x'></option>, ...altitudes.map((altitude, i) => ExitAltitudeOption(altitude, i))]
}

const ExitAltitudeOption = (altitude, i) => (
  <option key={i} value={altitude}>{Number(altitude).toLocaleString()}</option>
)

const DeploymentAltitudeOptions = () => {
  let altitudes = []
  for(let x = 3500; x <= 15000; x += 500) {
    altitudes.push(x)
  }
  return [<option key='x'></option>, ...altitudes.map((altitude, i) => DeploymentAltitudeOption(altitude, i))]
}

const DeploymentAltitudeOption = (altitude, i) => (
  <option key={i} value={altitude}>{Number(altitude).toLocaleString()}</option>
)

const delay = (jump) => {
  if(jump.exit_altitude && jump.deployment_altitude) {
    return Math.ceil((((jump.exit_altitude - jump.deployment_altitude) / 1000) * 5.5) + 5) + " seconds"
  }
  return ""
}
