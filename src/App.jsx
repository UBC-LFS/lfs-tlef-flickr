import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import AlbumContainer from './containers/AlbumContainer';
import GalleryContainer from './containers/GalleryContainer';

const App = () => (
  <Router>
    <div>
      <Route exact path="/" component={AlbumContainer} />
      <Route path="/album" component={GalleryContainer} />
    </div>
  </Router>
);

export default App;
