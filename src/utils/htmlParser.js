import fetch from 'isomorphic-fetch';

const SHEET_ID = "1m0yToSyGqCWOOBVgLFipRyXqfEeUn812_Yk5Gbu7I-U";
const API_KEY = "AIzaSyBw3Tmv6G69vJF0USujX77ZUjQvFNz7OPw";
const API_CALL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?includeGridData=true&key=${API_KEY}`;

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
          if (Object.keys(formatObj)[0] === "bold") {
            keyDef = keyDef.replace(formatObj.bold, '<b>' + formatObj.bold + '</b>');
          }
          if (Object.keys(formatObj)[0] === "italic") {
            keyDef = keyDef.replace(formatObj.italic, '<i>' + formatObj.italic + '</i>');
          }
        });
      }
      dictionaryObj[keyTerm] = keyDef;
    }
  });
  return dictionaryObj;
}

const fetchDefinitions = () => (
  fetch(API_CALL).then(response => {
    console.log(response)
    if (response.ok) {
      return response.json()
    }
    throw new Error('404 : no response');
  }).then(json => json.sheets[0].data[0].rowData)
    .then(definitions => parser(definitions))
    .catch(error => console.log('Error:' + error.message))
);

export default fetchDefinitions;
