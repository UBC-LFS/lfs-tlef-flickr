import React from 'react';
import App from './App.jsx';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import FlickrGallery from './containers/FlickrGallery';

// render( <App/>, document.querySelector("#app"));

render((
  <Router history={browserHistory}>
    <Route path='/' component={App}>
    </Route>
  </Router>
), document.querySelector("#app"))