import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import InlineConfirmButton from 'react-inline-confirm'
const path = require('path')

export default class VideoPane extends Component {
  onDrop (files) {
    let file = files[0]
    let { student, jump, settings } = {...this.props}
    this.props.copyVideoFile(student, jump, file, settings, (video_file) => {
      student.jumps.find(j => {
        return j.id === jump.id
      }).video_file = video_file
      this.props.saveStudent(student)
    })
  }
  render () {
    let { student, jump, video, removeVideo, settings } = this.props
    if (student._id === "new") { return <div></div> } // on app reload, student hasn't been loaded on first render
    if ( ! settings.videoFilePath ) return <FilePathNotSet/>
    if ( video.copy_in_progress ) return <ProgressBar percent={video.percent}/>
    if ( jump.video_file ) return <Video student={student} jump={jump} settings={settings} removeVideo={removeVideo}/>
    // console.log(settings.videoFilePath, student.original_name, jump.video_file)
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

const VideoFileNotFound = ({src}) => (
  <div className="dropzone">
    <span className="drop-zone-text">Could not find video file: {src}</span>
  </div>
)

const ProgressBar = ({percent}) => (
  <div className="dropzone">
    <span className="drop-zone-text">Copying: {percent} %</span>
    <progress value={percent} max={100}></progress>
  </div>
)

const Video = ({student, jump, removeVideo, settings}) => {
  let src = path.join(settings.videoFilePath, student.original_name, jump.video_file)
  let exists
  try {
    exists = fs.statSync(src)
  } catch (e) {
    exists = false
  }
  if (! exists) { return ( <VideoFileNotFound src={src}/> ) }
  return (
    <div className="">
      <div className="dropzone">
        <video width="100%" error={e => alert(`Not found: ${src}`)} controls>
          <source src={src} type="video/mp4"/>
        </video>
      </div>
      {(
        student.modified ?
        <InlineConfirmButton
          className='btn btn-warning pull-right'
          textValues={["Remove Video", "Are you sure?", "Removing..."]}
          showTimer={true}
          isExecuting={false}
          onClick={e => removeVideo(student, jump, settings, fs)}
          >
          <span className="icon icon-trash icon-text"></span>
        </InlineConfirmButton> :
        ""
      )}
    </div>
  )
}
