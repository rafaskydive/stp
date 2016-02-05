import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import InlineConfirmButton from 'react-inline-confirm'
import { connect } from 'react-redux'
import * as actionCreators from '../actions'
import moment from 'moment'
const path = require('path')

import settings from '../../settings'

class VideoDropzone extends Component {

  onDrop (files) {
    let file = files[0]
    let { student, jump, settings } = {...this.props}
    this.props.copyVideoFile(student, jump, file, settings, (video_file) => {
      student.jumps.find(j => {
        return j.jump_date === jump.jump_date
      }).video_file = video_file
      this.props.saveStudent(student)
    })
  }

  removeVideo (e) {
    this.props.removeVideo(this.props.student, this.props.jump)
  }

  render  () {
    let { videoDropzone, settings } = {...this.props}
    let video_file = this.props.jump.video_file // this || this.props.videoDropzone.video_file
    if (video_file) {
      let src = path.join(settings.videoFilePath, this.props.student._id, video_file)
      return (
        <div className="">
          <div className="dropzone">
            <video width="100%" controls>
              <source src={src} type="video/mp4"/>
            </video>
          </div>
          <InlineConfirmButton
            className='btn btn-warning pull-right'
            textValues={["Remove Video", "Are you sure?", "Removing..."]}
            showTimer={true}
            isExecuting={false}
            onClick={e => this.removeVideo(e)}
            >
            <span className="icon icon-trash icon-text"></span>
          </InlineConfirmButton>
        </div>
      )
    }
    if (this.props.videoDropzone.percent > 0) {
      return (
        <div className="dropzone">
          <span className="drop-zone-text">Copying: {this.props.videoDropzone.percent} %</span>
          <progress value={this.props.videoDropzone.percent} max={100}></progress>
        </div>
      )
    }
    return (
      <div className="">
        <Dropzone
          className='dropzone'
          multiple={false}
          accept="video/mp4"
          onDrop={(files) => this.onDrop(files)}
          style={{width: '100%', border: '1px solid black', height: '480px'}}
          >
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
