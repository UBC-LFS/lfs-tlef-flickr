import React, { PropTypes } from 'react';
import LazyLoad from 'react-lazyload';
import { createURL } from '../utils/utils';

const Photos = (props) => {
    
    const handleClick = (index) => {
        props._onClick(index);
    }

    const photos = props.images.map((image, index) => {
        if (image[0]) {
            const source = image[0];
            const sourceWithSize = createURL('large', source);
            const title = image[1];
            const description = image[2];

            return (
                <LazyLoad height={200} once key={index}>
                    <div className="photoContainer">
                        <h1>{title}</h1>

                        <img key={index} src={source} onClick={handleClick.bind(null, index)} className="image"/>        
                    </div>    
                </LazyLoad>
            );
        }
    });

    return (
      <div id="container">
          <div id="images">
              {photos}
          </div>
      </div>
    );
}

Photos.propTypes = {
    images: PropTypes.array.isRequired,
    _onClick: PropTypes.func.isRequired,
}

export default Photos;