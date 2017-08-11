import fetch from 'isomorphic-fetch';
import Promise from 'es6-promise-promise';
import R from 'ramda';

const API_CALL = "https://sheets.googleapis.com/v4/spreadsheets/1wmZ7HuTM941dqUFmnsViP3lVkRpxjyjz0U0RasR1rR4?includeGridData=true&key=AIzaSyAb5iemYiKoj96gVztUPy_M1yNQmkfQBL8"

const fetchDefinitions = () => (
  fetch(API_CALL)
    .then(response => response.json())
    .then(json => json.sheets[0].data[0].rowData)
    .then(definitions => parser(definitions))
);

const parser = definitions => {
  definitions.splice(0, 1);
  let formatDef = [];
  let dictionaryObj = {};
  definitions.forEach((defobj) => {

    const keyTerm = defobj.values[0].formattedValue;
    let keyDef = defobj.values[1].formattedValue;

    if (typeof keyTerm !== 'undefined') {
      if (typeof defobj.values[1].textFormatRuns !== 'undefined') {
        defobj.values[1].textFormatRuns.splice(0, 1);

        let formattingArray = [];

        for (let i = 0; i < defobj.values[1].textFormatRuns.length; i += 2) {
          let format = Object.keys(defobj.values[1].textFormatRuns[i].format);
          const first = defobj.values[1].textFormatRuns[i].startIndex;
          const last = defobj.values[1].textFormatRuns[i + 1].startIndex;
          const replaceWord = keyDef.substring(first, last);
          let formatObj = {};
          formatObj[format] = replaceWord;
          formattingArray.push(formatObj);
        }

        formattingArray.forEach(formatObj => {
          if (Object.keys(formatObj)[0] == "bold") {
            keyDef = keyDef.replace(formatObj.bold, '<b>' + formatObj.bold + '</b>');
          }
          if (Object.keys(formatObj)[0] == "italic") {
            keyDef = keyDef.replace(formatObj.italic, '<i>' + formatObj.italic + '</i>');
          }
        });
      }
      dictionaryObj[keyTerm] = keyDef;
    } 
  });
  
  return dictionaryObj;
}

export default fetchDefinitions;
