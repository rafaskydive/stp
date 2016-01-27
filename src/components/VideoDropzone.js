import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'
import * as actionCreators from '../actions'
import moment from 'moment'
const path = require('path')

import config from '../config'

class VideoDropzone extends Component {

  onDrop (files) {
    let file = files[0]
    let student = {...this.props.student}
    let jump = {...this.props.jump}
    this.props.copyVideoFile(student, jump, file, (video_file) => {
      student.jumps[jump._id].video_file = video_file
      this.props.saveStudent(student)
    })
  }

  removeVideo (e) {
    this.props.removeVideo(this.props.student, this.props.jump)
  }

  render  () {
    let { videoDropzone } = {...this.props}
    let video_file = this.props.jump.video_file // this || this.props.videoDropzone.video_file
    if (video_file) {
      let src = path.join('videos', this.props.student._id, video_file)
      return (
        <div>
          <div className="dropzone">
            <video width="720px" controls>
              <source src={src} type="video/mp4"/>
            </video>
          </div>
          <button className='btn btn-warning pull-right' onClick={e => this.removeVideo(e)}>
            <span className="icon icon-trash icon-text"></span>
            Remove Video
          </button>
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
  return state
}

const mapDispatchToProps = Object.assign({}, actionCreators, {
})

export default connect(mapStateToProps, mapDispatchToProps)(VideoDropzone)
