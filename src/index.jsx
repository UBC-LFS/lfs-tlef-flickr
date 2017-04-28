import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import GalleryContainer from './containers/GalleryContainer';
import FlickrGallery from './containers/FlickrGallery';

const App = () => {
    return (
      <div>
        <GalleryContainer />
      </div>
    );
};

// render( <App/>, document.querySelector("#app"));

render((
  <Router history={browserHistory}>
    <Route path='/' component={App}>
    </Route>
  </Router>
), document.querySelector("#app"))