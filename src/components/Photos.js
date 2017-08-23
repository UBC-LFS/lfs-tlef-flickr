import React from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';
import createURL from '../utils/utils';

const Photos = (props) => {
	const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	const imgDiv = document.getElementById("images");

	let resize = (props.imageWidth - (props.imageWidth * .4));
	let offSet = 0;

	if (imgDiv !== null) {
		const divWidth = imgDiv.offsetWidth;
		const imagesOnScreen = Math.floor((divWidth / resize));
		const space = (divWidth - (imagesOnScreen * resize));
		offSet = (space / imagesOnScreen);
	}

	const photoContainerStyle = {
		width: (resize + offSet) + 'px',
		height: (resize + offSet) + 'px'
	}

	const handleClick = (index) => {
		props._onClick(index);
	}

	const photos = props.images.map((image, index) => {
		if (image.imageURL) {
			const source = image.imageURL;
			const sourceWithSize = createURL('large', source);
			const title = image.title;
			const description = image.description.replace(/<\/?[^>]+(>|$)/g, "");
      const orientation = image.orientation;

			return (
				<LazyLoad height={200} offset={screenHeight * screenHeight} once key={index}>
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
							<img key={index} src={source} onClick={handleClick.bind(null, index)} className={"image" + (orientation === "landscape"
								? " fullHeight"
								: " fullWidth")}/>
						</div>
					</div>
				</LazyLoad>
			);
		}
	});

	return (
		<div id="row-fluid">
			<div id="images">
				{photos}
			</div>
		</div>
	);
}

Photos.propTypes = {
	images: PropTypes.array.isRequired,
	_onClick: PropTypes.func.isRequired
}

export default Photos;
