import React from 'react';
import PropTypes from 'prop-types';

const AlbumSetCover = (props) => {
    // const imageCoverCounter = () => {
    //     let count = 0;
    //     switch(true)
    //     {
    //         case (props.albumInfo.albumDetails.photo.length === 1):
    //             count = 1;
    //             break;
    //         case (props.albumInfo.albumDetails.photo.length === 2):
    //             count = 2;
    //             break;
    //         case (props.albumInfo.albumDetails.photo.length >= 3):
    //             count = 3;
    //             break;
    //         default:
    //             count = 0;
    //     }
    //     return (
    //         count
    //     )
    // }

    const albumCoverSize = {
        width: props.albumSize + 'px',
        height: props.albumSize + 'px'
    }
            /*{Array.apply(null, Array(imageCoverCounter())).map((item, index) => {
                return (
                    <img
                        key={index} 
                        className="coverImage"
                        src={props.albumInfo.albumDetails.photo[index].imageURL}
                    />
                )
            })}*/

    return (
        <div
            style={albumCoverSize} 
            className="albumCover">
            <div>
                <span>{props.albumInfo.albumName}</span>
            </div>
            <img
                className="coverImage"
                src={props.albumInfo.albumDetails.photo[0].imageURL}
            />
        </div>
    )
}

AlbumSetCover.PropTypes = {
    albumInfo: PropTypes.array.isRequired
}

export default AlbumSetCover;
