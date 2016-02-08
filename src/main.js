import './styles/styles.scss';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk';
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { syncHistory, routeReducer } from 'redux-simple-router'
import * as reducers from './reducers'
import { Settings, StudentList, StudentWrapper, Student, Jump } from './components'

const middleware = syncHistory(hashHistory);

const reducer = combineReducers(Object.assign({}, reducers, {
  routing: routeReducer
}));

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey='H'
               changePositionKey='Q'
               defaultIsVisible={false}>
    <LogMonitor theme='solarized' />
  </DockMonitor>
);

const finalCreateStore = compose(
  applyMiddleware(middleware, thunk),
  DevTools.instrument()
)(createStore);
const store = finalCreateStore(reducer);

middleware.listenForReplays(store);

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Router history={hashHistory}>
        <Route path="/" component={(props)=>(props.children)}>
          <IndexRoute component={StudentList}/>
          <Route path="student/:id" component={StudentWrapper}>
            <IndexRoute component={Student}/>
            <Route path="jump/:jump_id" component={Jump}/>
          </Route>
          <Route path="settings" component={Settings}/>
        </Route>
      </Router>
      <DevTools />
    </div>
  </Provider>,
  document.getElementById('app')
);
