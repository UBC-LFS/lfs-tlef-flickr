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

    const imageURLLink = () => {
        console.log(props);
        return props.albumInfo.albumDetails.photo[0].imageURL
    }

    const albumCoverSize = () => {
        return {
            width: props.albumSize + 'px',
            height: props.albumSize + 'px'
        }
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
            style={albumCoverSize()} 
            className="albumCover">
            <div className="albumCoverName">
                <span>{props.albumInfo.albumName}</span>
            </div>
            <div className="albumOuterContainer">
                <div className="albumInnerContainer">
                    <img
                        className={"coverImage" + (props.albumInfo.albumDetails.photo[0].orientation ===
                        "landscape" ? " fullHeight" : " fullWIdth")}
                        src={imageURLLink()}
                    />
                </div>
            </div>
        </div>
    )
}

AlbumSetCover.PropTypes = {
    albumInfo: PropTypes.array.isRequired
}

export default AlbumSetCover;
