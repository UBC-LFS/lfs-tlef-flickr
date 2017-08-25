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
		<Link to={{
			pathname: `/album`,
			search: `?albumID=${props.albumInfo.albumID}&albumName=${props.albumInfo.albumName}`
		}}>
			<div style={albumCoverSize()} className="albumCover">

				<div className="albumCoverName">
					<span>{props.albumInfo.albumName}</span>
				</div>
				<div className="albumCoverDescription">
					<span>
						{props.albumInfo.albumDetails.photo.length > 1 ? (
							props.albumInfo.albumSize + " photos"
						) : (
							props.albumInfo.albumSize + " photo"
						)}
					</span>
				</div>
				<div className="albumOuterContainer">
						<div className="albumInnerContainer">
							<img className={"coverImage" + (props.albumInfo.albumDetails.photo[0].orientation === "landscape"
								? " fullHeight"
								: " fullWIdth")} src={props.albumInfo.albumDetails.photo[0].imageURL}/>
						</div>
					
				</div>

			</div>
		</Link>
	)
}

AlbumSetCover.PropTypes = {
	albumInfo: PropTypes.array.isRequired
}

export default AlbumSetCover;
