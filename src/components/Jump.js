import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
import moment from 'moment'
const path = require('path')

const VideoDropzone = React.createClass({
  getInitialState: function() {
    return {files: []}
  },
  onDrop: function(files) {
    let file = files[0].path
    let dirname = path.dirname(file)
    let extname = path.extname(file)
    let outfile = path.join(dirname, `outfile${extname}`)
    fs.createReadStream(file).pipe(fs.createWriteStream(outfile))
    this.setState({files: files})
  },
  render: function () {
    return (
      <div>
        <Dropzone onDrop={this.onDrop}>
          <div className="drop-zone-text">
            Drop video file here, or click to select file to upload.
          </div>
          {(() => { if (this.state.files.length > 0) {
            <div><img src={this.state.files[0].preview} /></div>
          }})()}
        </Dropzone>
        <div>files: {this.state.files.length}</div>
        { this.state.files.length > 0 ?
          <div>
            <div>{this.state.files.map((file) => <img key={file.name} src={file.preview} style={{height: '200px'}} />)}</div>
          </div>
          : <div>WEE</div>
        }
      </div>
    )
  }
})

class Jump extends Component {
  componentDidMount () {
    if (this.props.student._id === null) {
      this.props.fetchStudent(this.props.params.id)
    }
  }

  goBack() {
    this.props.goBack()
  }

  render () {
    let { student } = {...this.props}
    if (this.props.student._id === null) { return <div></div> }
    let jump = student.jumps.find(j => { return j.date === this.props.params.jump_date})
    return (
      <div className="pane-group">
        <div className="pane">
          <header className="sub-header">
            <div className="toolbar-actions">
              <div className="btn-group pull-right">
                <button className="btn btn-default" onClick={() => this.goBack()}>
                  <span className="icon icon-left-open icon-text"></span>
                  Back
                </button>
              </div>
              <span className="page-title">Dive Flow {jump.dive_flow}</span>
              <span>{student.name}</span>
              <span>{moment(jump.date).format('MMMM Do YYYY')}</span>
            </div>
          </header>
          <VideoDropzone />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { student: state.student }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {
  goBack: routeActions.goBack
})

export default connect(mapStateToProps, mapDispatchToProps)(Jump)
