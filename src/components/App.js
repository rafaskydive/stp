const React = require('react');
const { Link } = require('react-router');
const { connect } = require('react-redux');
const { routeActions } = require('redux-simple-router');

function App({ push, goForward, goBack, children }) {
  return (
    <div className="window">
      <header className="toolbar toolbar-header">
        <div className="toolbar-actions">
          <div className="btn-group">
            <div className="btn btn-default">
              <span className="icon icon-left"
                onClick={() => goBack()}
              ></span>
            </div>
            <div className="btn btn-default">
              <span className="icon icon-right"
                onClick={() => goForward()}
              ></span>
            </div>
          </div>

          <div className="btn-group">
            <div className="btn btn-default">
              <span className="icon icon-home"
                onClick={() => push('/')}
              ></span>
            </div>
          </div>

          <div className="btn-group">
            <div className="btn btn-default">
              <span className="icon icon-home"
                onClick={() => push('/foo')}
              ></span>
            </div>
            <div className="btn btn-default">
              <span className="icon icon-home"
                onClick={() => push('/bar')}
              ></span>
            </div>
          </div>

        </div>
      </header>
      <div className="window-content">
        <div className="pane padded">
          {children}
        </div>
      </div>
    </div>
  )
};

module.exports = connect(
  null,
  {
    push: routeActions.push,
    goForward: routeActions.goForward,
    goBack: routeActions.goBack
  }
)(App);
