import React, { PropTypes } from 'react';
import LazyLoad from 'react-lazyload';
import createURL from '../utils/utils';

const Photos = (props) => {

    const handleClick = (index) => {
        props._onClick(index);
    }

    const photoContainerStyle = {
        width: props.imageWidth + 'px',
        height: props.imageWidth + 'px',
        marginRight: 5 + 'px'
    }

    const photos = props.images.map((image, index) => {
        if (image.imageURL) {
            const source = image.imageURL;
            const sourceWithSize = createURL('large', source);
            const title = image.title;
            const description = image.description;
            const orientation = image.orientation;
            return (
                <LazyLoad height={200} offset={1000} once key={index}>
                    <div className="photoContainer" style={photoContainerStyle}>
                        <div className="imageTitle"><span>{title}</span></div>
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
