import React from 'react';
import App from './App.jsx';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

// render( <App/>, document.querySelector("#app"));

render((
  <Router history={browserHistory}>
    <Route path='/' component={App}>
    </Route>
  </Router>
), document.querySelector("#app"))
