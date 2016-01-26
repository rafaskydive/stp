import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'
import * as actionCreators from '../actions'
import moment from 'moment'
const path = require('path')

class VideoDropzone extends Component {

  onDrop (files) {
    let file = files[0]
    let student = {...this.props.student}
    let jump = {...this.props.jump}
    this.props.copyVideoFile(student, jump, file, (dest) => {
      student.jumps[jump._id].video_file = dest
      this.props.saveStudent(student)
    })
  }

  render  () {
    let { videoDropzone } = {...this.props}
    let video_file = this.props.videoDropzone.video_file || this.props.jump.video_file
    if (video_file) {
      let src = video_file.replace(/public\//,'')
      return (
        <div className="dropzone">
          <video width="720px" controls>
            <source src={src} type="video/mp4"/>
          </video>
        </div>
      )
    }
    if (this.props.videoDropzone.percent > 0) {
      return (
        <div className="dropzone">
          <strong>Copying: {this.props.videoDropzone.percent} %</strong>
          <progress value={this.props.videoDropzone.percent} max={100}></progress>
        </div>
      )
    }
    return (
      <div>
        <Dropzone className='dropzone' onDrop={(files) => this.onDrop(files)} style={{width: '100%', border: '1px solid black', height: '480px'}}>
          <div className="drop-zone-text text-center">
            Drop video file here, or click to select file to upload.
          </div>
        </Dropzone>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { videoDropzone: state.videoDropzone }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {
})

export default connect(mapStateToProps)(VideoDropzone)
