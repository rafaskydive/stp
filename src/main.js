import './styles/styles.scss';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { syncHistory, routeReducer } from 'redux-simple-router'
import reducers from './reducers'
import { App, Home, Foo, Bar } from './components'

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
