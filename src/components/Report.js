import React, { Component } from 'react'
import LoadingThing from './LoadingThing'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
import moment from 'moment'

class Report extends Component {
  componentWillMount () {
    if(this.props.report.jumpsByMonth.length === 0) {
      this.props.jumpsByMonth()
    }
  }
  render () {
    let ReportPaneContent = this.props.report.loading ? LoadingThing : ReportWrapper
    return (
      <div className="window">
        <Header {...this.props}/>
        <ReportPaneContent {...this.props}/>
        <Footer {...this.props}/>
      </div>
    )
  }
}

const Header = props => (
  <header className="toolbar toolbar-header">
    <Toolbar {...props}/>
  </header>
)

const Toolbar = ({push}) => (
  <div className="toolbar-actions text-center">
    <span className="page-title">Report</span>
    <button className="btn btn-default pull-left" onClick={e => push('/')}>
      <span className="icon icon-home"></span>
    </button>
  </div>
)

const Footer = props => (
  <div className="toolbar toolbar-footer">
    Footer
  </div>
)

const ReportWrapper = props => (
  <div className="window-content">
    <table className="table-striped">
      <thead>
        <tr>
          <th>Month</th>
          <th>Jumps</th>
        </tr>
      </thead>
      <tbody>
        {reportRows(props.report.jumpsByMonth)}
      </tbody>
    </table>
  </div>
)

const reportRows = (jumpsByMonth) => (
  jumpsByMonth.map((row, i) => renderRow(row, i))
)

const renderRow = (row, i) => (
  <tr key={i}>
    <td>
      {moment(`${row.key[0]}-${row.key[1]}-01`).format("MMMM YYYY")}
    </td>
    <td>
      {row.value}
    </td>
  </tr>
)
function mapStateToProps(state) {
  return { report: state.report }
}

const mapDispatchToProps = Object.assign({}, {
  push: routeActions.push,
  jumpsByMonth: actionCreators.jumpsByMonth
})
export default connect(mapStateToProps, mapDispatchToProps)(Report)
