import React from 'react';
import PropTypes from 'prop-types';

const AlbumSetCover = (props) => {

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
            <div className="albumCoverDescription">
                <span>Photos</span>
            </div>
            <div className="albumOuterContainer">
                <div className="albumInnerContainer">
                    <img
                        className={"coverImage" + (props.albumInfo.albumDetails.photo[0].orientation ===
                        "landscape" ? " fullHeight" : " fullWIdth")}
                        src={props.albumInfo.albumDetails.photo[0].imageURL}
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
