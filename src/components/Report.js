import React, { Component } from 'react'
import LoadingThing from './LoadingThing'
import { HeaderButtons } from './HeaderButtons'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
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

const Toolbar = props => (
  <div className="toolbar-actions text-center">
    <HeaderButtons {...props}/>
  </div>
)

const Footer = props => (
  <div className="toolbar toolbar-footer">
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
  return { report: state.report, auth: state.auth }
}

const mapDispatchToProps = Object.assign({}, {
  push: routeActions.push,
  jumpsByMonth: actionCreators.jumpsByMonth,
  logout: actionCreators.logout
})
export default connect(mapStateToProps, mapDispatchToProps)(Report)
