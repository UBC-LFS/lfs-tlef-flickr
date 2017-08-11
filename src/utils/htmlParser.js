import fetch from 'isomorphic-fetch';
import Promise from 'es6-promise-promise';

const URI = "https://sheets.googleapis.com/v4/spreadsheets/1wmZ7HuTM941dqUFmnsViP3lVkRpxjyjz0U0RasR1rR4?includeGridData=true&key=AIzaSyAb5iemYiKoj96gVztUPy_M1yNQmkfQBL8"

const fetchDefinitions = () => (
  fetch(URI)
    .then(response => response.json())
    .then(json => console.log(json))
);

export default fetchDefinitions;
