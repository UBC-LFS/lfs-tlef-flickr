import React from 'react';
import { HashRouter , Router, Route, Switch, Link } from 'react-router-dom';
import AlbumContainer from './containers/AlbumContainer';
import GalleryContainer from './containers/GalleryContainer';

const baseURL = "/flickr-album-demo"

const App = () => (
  <HashRouter 
  basename={baseURL}
  >
    <div>
      <Switch>
      <Route exact path="/" component={AlbumContainer} />
      <Route path="/album" component={GalleryContainer} />
      <Route
        render={() => (
          <div>
            <h1 className="fourZeroFour">404: Page Not Found </h1>
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
  </HashRouter>
);

export default App;
