import React from 'react';
import ReactLoading from 'react-loading';

const Loading = (props) => {
  const loadStyle = {
    height: (props.browserHeight + 250) / 2 + 'px',
  }
  return (
    <ReactLoading
      className="center"
      type="spin"
      color="#444"
      delay={0}
      style={loadStyle}
    />
  );
};

export default Loading;
