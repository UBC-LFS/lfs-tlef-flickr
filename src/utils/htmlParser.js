import fetch from 'isomorphic-fetch';
import Promise from 'es6-promise-promise';

const API_CALL = "https://sheets.googleapis.com/v4/spreadsheets/1wmZ7HuTM941dqUFmnsViP3lVkRpxjyjz0U0RasR1rR4?includeGridData=true&key=AIzaSyAb5iemYiKoj96gVztUPy_M1yNQmkfQBL8"

const fetchDefinitions = () => (
  fetch(API_CALL)
    .then(response => response.json())
    .then(json => json.sheets[0].data[0].rowData)
    .then(definitions => parser(definitions))
);

const parser = definitions => {
  definitions.splice(0,1)
  console.log(definitions);
  let formatDef = [];
  definitions.forEach((defobj) => {
    let dictionaryObj = {}
    const keyTerm = defobj.values[0].formattedValue;
    let keyDef = defobj.values[1].formattedValue;

    if (typeof keyTerm !== 'undefined') {
      if (typeof defobj.values[1].textFormatRuns !== 'undefined') {
        defobj.values[1].textFormatRuns.splice(0,1)
        console.log(defobj.values[1].textFormatRuns)
      }


      dictionaryObj[keyTerm] = "hi";
    }

  });
}

export default fetchDefinitions;
