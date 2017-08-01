import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import AlbumContainer from './containers/AlbumContainer';
import GalleryContainer from './containers/GalleryContainer';

const App = () => (
  <Router>
    <div>
      <Switch>
      <Route exact path="/" component={AlbumContainer} />
      <Route path="/album" component={GalleryContainer} />
      <Route render={() => <h1 className="fourZeroFour">404: Page Not Found </h1>} />
       </Switch>
    </div>
  </Router>
);

export default App;
