import './styles/styles.scss';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

const React = require('react');
const ReactDOM = require('react-dom');
const { applyMiddleware, compose, createStore, combineReducers } = require('redux');
const { Provider } = require('react-redux');
const { Router, Route, IndexRoute, hashHistory } = require('react-router');
const { syncHistory, routeReducer } = require('redux-simple-router');

const reducers = require('./reducers');
const { App, Home, Foo, Bar } = require('./components');

const middleware = syncHistory(hashHistory);
const reducer = combineReducers(Object.assign({}, reducers, {
  routing: routeReducer
}));

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey='ctrl-h'
               changePositionKey='ctrl-q'>
    <LogMonitor theme='tomorrow' />
  </DockMonitor>
);

const finalCreateStore = compose(
  applyMiddleware(middleware),
  DevTools.instrument()
)(createStore);
const store = finalCreateStore(reducer);
middleware.listenForReplays(store);

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Home}/>
          <Route path="foo" component={Foo}/>
          <Route path="bar" component={Bar}/>
        </Route>
      </Router>
      <DevTools />
    </div>
  </Provider>,
  document.getElementById('app')
);
