import React, { Component } from 'react'
import moment from 'moment'

class Note extends Component {
  render () {
    let { note } = {...this.props}
    return (
      <li className="list-group-item" key={note.date}>
        <div className="media-body">
          <strong>{moment(note.date).format("dddd, MMMM Do h:mm a")}</strong>
          <p>{note.text}</p>
        </div>
      </li>
    )
  }
}

class Header extends Component {
  saveNote(e) {
    e.preventDefault()
    this.props.saveNote(this.refs.noteText.value)
  }

  hideForm(e) {
    e.preventDefault()
    this.props.hideForm()
  }

  render () {
    if(this.props.creatingNote) {
      return (
        <li className="list-group-header">
          <form>
            <div className="form-group">
              <label>Note</label>
              <textarea ref="noteText" className="form-control" rows="3" defaultValue=""/>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" onClick={e => this.saveNote(e)}>
                <span className="icon icon-install icon-text"></span>
                Save Note
              </button>
              <button className="btn btn-default" onClick={e => this.hideForm(e)}>
                <span className="icon icon-ccw icon-text"></span>
                Cancel
              </button>
            </div>
          </form>
        </li>
      )
    } else {
      return (
        <li className="list-group-header">
          <button className="btn btn-default" onClick={e => this.props.createNote(e)}>
            <span className="icon icon-list-add icon-text"></span>
            Add Note
          </button>
        </li>
      )
    }
  }
}

export default class Notes extends Component {
  constructor() {
    super()
    this.state = {
      creatingNote: false
    }
  }

  createNote() {
    this.setState({creatingNote: true})
  }

  hideForm() {
    this.setState({creatingNote: false})
  }

  saveNote(text) {
    // TODO: handle validation of note (can't be blank)
    let note = {
      date: moment().format(),
      text: text
    }
    this.props.saveNote(this.props.student, note)
    this.setState({creatingNote: false})
  }

  _sortedNotes() {
    return this.props.student.notes.sort((a, b) => {
      return a.date < b.date
    })
  }

  render () {
    let { student } = {...this.props}
    return (
      <ul className="list-group">
        <Header
          createNote={e => this.createNote()}
          hideForm={e => this.hideForm()}
          creatingNote={this.state.creatingNote}
          saveNote={e => this.saveNote(e)}
        />
        {this._sortedNotes().map(_note => {
          return <Note note={_note} key={_note.date}/>
        })}
      </ul>
    )
  }
}
