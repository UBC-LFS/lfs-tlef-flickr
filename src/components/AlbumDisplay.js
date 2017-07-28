import React from 'react';
import PropTypes from 'prop-types';
import AlbumSetCover from './AlbumSetCover';

const AlbumDisplay = (props) => {
    const albumSet = props.albums.map((album, index) => {
        return (
            <div key={index}>
                <AlbumSetCover
                    albumInfo={album}
                />
            </div>
        );
    });

    return(
        <div id="albumsDisplay">
            {albumSet}
        </div>
    );
}

AlbumDisplay.PropTypes = {
    albums: PropTypes.array.isRequired
}

export default AlbumDisplay;
