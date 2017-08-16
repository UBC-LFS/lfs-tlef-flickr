import fetch from 'isomorphic-fetch';

const SHEET_ID = '1m0yToSyGqCWOOBVgLFipRyXqfEeUn812_Yk5Gbu7I-U';
const API_KEY = 'AIzaSyBw3Tmv6G69vJF0USujX77ZUjQvFNz7OPw';
const API_CALL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?includeGridData=true&key=${API_KEY}`;


const parseFormatting = (formatCriteria, plainDesc) => {
  const formattedText = [];
  for (let i = 0; i < formatCriteria.length; i += 2) {
    const style = Object.keys(formatCriteria[i].format);
    const wordStartIndex = formatCriteria[i].startIndex;
    const wordEndIndex = formatCriteria[i + 1].startIndex;
    const wordToReplace = plainDesc.substring(wordStartIndex, wordEndIndex);
    const formatObj = {};
    formatObj[style] = wordToReplace;
    formattedText.push(formatObj);
  }
  console.log(formattedText)
  return formattedText;
};

const applyFormatting = (formatArray, plainDef) => {
  let styleCriteria = formatArray;
  let styleDef = plainDef;
  styleCriteria.forEach((formatObj) => {
    let htmlStyle = styleDef;
    let style = Object.keys(formatObj)[0];
    switch(style) {
      case 'bold':
        htmlStyle = `<b>${formatObj[style]}</b>`;
        break;
      case 'italic':
        htmlStyle = `<i>${formatObj[style]}</i>`;
        break;
      case 'strikethrough':
        htmlStyle = `<del>${formatObj[style]}</del>`;
        break;
      case 'foregroundColor':
        htmlStyle = `<mark>${formatObj[style]}</mark>`;
        break;
      case 'underline':
        htmlStyle = `<ins>${formatObj[style]}</ins>`;
        break;
    }
    styleDef = styleDef.replace(formatObj[style], htmlStyle);
  });
  return styleDef;
};

const parser = (definitions) => {
  definitions.splice(0, 1);
  const dictionaryObj = {};
  definitions.forEach((defobj) => {
    const formatCriteria = defobj.values[1].textFormatRuns;
    const plainKeyTerm = defobj.values[0].formattedValue;
    let keyDef = defobj.values[1].formattedValue;
    if (typeof plainKeyTerm !== 'undefined' && typeof keyDef !== 'undefined') {
      if (typeof formatCriteria !== 'undefined') {
        formatCriteria.splice(0, 1);
        keyDef = applyFormatting(parseFormatting(formatCriteria, keyDef), keyDef);
      }
      dictionaryObj[plainKeyTerm] = keyDef;
    }
  });
  return dictionaryObj;
};

const fetchDefinitions = () => (
  fetch(API_CALL).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('404 : no response');
  }).then(json => json.sheets[0].data[0].rowData)
    .then(definitions => parser(definitions))
    .catch(error => console.log(`Error: ${error.message}`))
);

export default fetchDefinitions;
