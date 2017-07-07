const createURL = (size, source) => {
  const stringAppend = (str, source) => {
    return source.split('.jpg', 1)[0].concat(str);
  }
  switch (size) {
    case 'thumbnail':
      return stringAppend('_t.jpg', source);

    case 'small':
      return stringAppend('_m.jpg', source);

    case 'large':
      return stringAppend('_b.jpg', source);

    case 'huge':
      return stringAppend('_k.jpg', source);

    case 'original':
      return stringAppend('_o.jpg', source);

    default:
      return source;
  }
};

export default createURL;
