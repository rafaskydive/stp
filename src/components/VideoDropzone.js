import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'
import * as actionCreators from '../actions'
import moment from 'moment'
const path = require('path')

class VideoDropzone extends Component {

  onDrop (files) {
    let file = files[0]
    console.log(file)
    this.props.copyVideoFile(this.props.student, this.props.jump, file)
  }

  render  () {
    let { videoDropzone } = {...this.props}
    console.log(videoDropzone)
    if (this.props.videoDropzone.video_file) {
      let src = this.props.videoDropzone.video_file.replace(/public\//,'')
      return (
        <div>
          <div>{this.props.videoDropzone.video_file}</div>
          <div><img src={src}/></div>
        </div>
      )
    }
    return (
      <div>
        <Dropzone onDrop={(files) => this.onDrop(files)}>
          <div className="drop-zone-text">
            Drop video file here, or click to select file to upload.
          </div>
          {(() => { if (this.props.videoDropzone.files.length > 0) {
            <div><img src={this.props.videoDropzone.files[0].preview} /></div>
          }})()}
        </Dropzone>
        <div>files: {this.props.videoDropzone.files.length}</div>
        { this.props.videoDropzone.files.length > 0 ?
          <div>
            <div>{this.props.videoDropzone.files.map((file) => <img key={file.name} src={file.preview} style={{height: '200px'}} />)}</div>
          </div>
          : <div>WEE</div>
        }
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
