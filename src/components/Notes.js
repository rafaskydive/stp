import React, { Component } from 'react'
import InlineConfirmButton from 'react-inline-confirm'
import moment from 'moment'

export default class Notes extends Component {
  render () {
    return (
      <ul className="list-group">
        <NotesHeader {...this.props}/>
        {renderNotes(this.props)}
      </ul>
    )
  }
}

const NotesHeader = ({student, createNote, cancelNote, changeNoteField, saveNote}) => {
  if (student.modified && student.new_note) { return (
    <li className="list-group-header">
      <form>
        <div className="form-group">
          <label>Note</label>
          <textarea
            className="form-control"
            rows="1"
            value={student.new_note.text}
            onChange={e => changeNoteField(student, 'text', e.target.value)}
            />
        </div>
        <div className="form-group">
          <label>Next Visit</label>
          <input
            type="date"
            className="form-control form-control-small"
            value={student.new_note.next_visit_date}
            onChange={e => changeNoteField(student, 'next_visit_date', e.target.value)}
            />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" onClick={e => saveNote(student)}>
            <span className="icon icon-install icon-text"></span>
            Save Note
          </button>
          <button className="btn btn-default" onClick={e => cancelNote(student)}>
            <span className="icon icon-ccw icon-text"></span>
            Cancel
          </button>
        </div>
      </form>
    </li>
  )} else if (student.modified) { return (
    <li className="list-group-header">
      <button className="btn btn-default" onClick={e => createNote()}>
        <span className="icon icon-list-add icon-text"></span>
        Add Note
      </button>
    </li>

  )} else return <span></span>
}
const renderNotes = ({student, removeNote}) => (
  student.notes.sort((a, b) => {
    return b.date > a.date
  }).map((note, i) => renderNote(i, student, note, removeNote))
)

const renderNote = (i, student, note, removeNote) => (
  <li className="list-group-item" key={i}>
    <div className="media-body">
      <strong>{moment(note.date).format("dddd, MMMM Do h:mm a")}</strong>
      <p>{note.text}</p>
      <NextVisitDate note={note}/>
    </div>
    <RemoveNoteButton student={student} note={note} removeNote={removeNote}/>
  </li>
)

const NextVisitDate = ({note}) => {
  return (
    !note.next_visit_date ?
    <span></span> :
    <span className="next-visit-date"><strong>Next Visit: </strong> {moment(note.next_visit_date, 'YYYY-MM-DD').format('dddd, MMMM Do')}</span>
  )
}

const RemoveNoteButton = ({student, note, removeNote}) => {
  return ! student.modified ? <span></span> :
  <span className="pull-right">
    <InlineConfirmButton
      className="btn btn-default"
      textValues={["Remove Note", "Are you sure?", "Removing"]}
      showTimer={true}
      isExecuting={false}
      onClick={e => removeNote(student, note)}
      >
      <span className="icon icon-trash icon-text"></span>
    </InlineConfirmButton>
  </span>
}
