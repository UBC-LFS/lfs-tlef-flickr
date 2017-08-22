import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import AlbumContainer from './containers/AlbumContainer';
import GalleryContainer from './containers/GalleryContainer';

const App = () => (
  <Router>
    <div>
      <Switch>
      <Route exact path="/" component={AlbumContainer} />
      <Route path="/album" component={GalleryContainer} />
      <Route
        render={() => (
          <div>
            <h1 className="fourZeroFour">404: Page Not Found </h1>
            <BrowserRouter basename="/flickr-album-demo"/>
            <Link
              className="homeBtn btn-primary btn-large"
              to={{
              pathname: `/`,
            }}>
            {'Home'}
          </Link>
          </div>
        )}/>
       </Switch>
    </div>
  </Router>
);

export default App;
