import React from 'react';
import ReactDom from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import { BrowserRouter as Router, browserHistory, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { LoggedInUser } from '../client/actions/LogInAction'
import thunk from 'redux-thunk';
import setAuthorizationToken from './util/setAuthorizationToken';
import rootReducer from './reducer/rootreducer';
import routes from './routes/routes';
import './css/style.scss';

const history = createHistory();

const store = createStore(
  rootReducer,
  compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f),
);
if(localStorage.user){
  const user = JSON.parse(localStorage.user)
    store.dispatch(LoggedInUser(user))
}
ReactDom.render(
  <Provider store={store}>
    <Router history={browserHistory}>{routes}</Router>
  </Provider>,
  document.getElementById('app'),
);
