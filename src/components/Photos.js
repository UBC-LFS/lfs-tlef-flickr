import React from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';
import createURL from '../utils/utils';

const Photos = (props) => {
  const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    const handleClick = (index) => {
        props._onClick(index);
    }

    const photoContainerStyle = {
        width: (props.imageWidth - (w/6) + 5) + 'px',
        height: (props.imageWidth - (w/6) + 5) + 'px'
    }

    const photos = props.images.map((image, index) => {
        if (image.imageURL) {
            const source = image.imageURL;
            const sourceWithSize = createURL('large', source);
            const title = image.title;
            const description = image.description;
            const orientation = image.orientation;

            return (
                <LazyLoad height={200} offset={2000} once key={index}>
                    <div className="photoContainer" style={photoContainerStyle}>
                        <div className="imageTitle">
                            <span>
                                {title}
                            </span>
                        </div>
                        <div className="imageDescription">
                            <span>
                                {description}
                            </span>
                        </div>
                        <div className="imageInner">
                            <img key={index}
                                src={source}
                                onClick={handleClick.bind(null, index)}
                                className={"image" + (orientation === "landscape" ? " fullHeight" : " fullWidth")}
                            />
                        </div>
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
