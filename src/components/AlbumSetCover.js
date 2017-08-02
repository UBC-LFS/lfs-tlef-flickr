import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

const AlbumSetCover = (props) => {

	const albumCoverSize = () => {
		return {
			width: props.albumSize + 'px',
			height: props.albumSize + 'px'
		}
	}

	return (
		<div style={albumCoverSize()} className="albumCover">

			<div className="albumCoverName">
				<span>{props.albumInfo.albumName}</span>
			</div>
			<div className="albumCoverDescription">
				<span>{props.albumInfo.albumDetails.photo.length} photos</span>
			</div>
			<div className="albumOuterContainer">
				<Link to={{
					pathname: `/album`,
					search: `?albumName=${props.albumInfo.albumName}`
				}}>

					<div className="albumInnerContainer">
						<img className={"coverImage" + (props.albumInfo.albumDetails.photo[0].orientation === "landscape"
							? " fullHeight"
							: " fullWIdth")} src={props.albumInfo.albumDetails.photo[0].imageURL}/>
					</div>
				</Link>
			</div>

		</div>
	)
}

AlbumSetCover.PropTypes = {
	albumInfo: PropTypes.array.isRequired
}

export default AlbumSetCover;
