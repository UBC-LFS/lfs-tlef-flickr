import React, {Component} from 'react';
import R from 'ramda';
import fetchImages from '../utils/Api';
import Loading from '../components/Loading';
import AlbumDisplay from '../components/AlbumDisplay';

export default class AlbumContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			albumSet: [],
			browserHeight: 0,
			imagesContainerWidth: 0,
			imageWidth: 0,
			imagesPerRow: 0,
			displayStage: "album",
		};
		this.resizeBrowser = this.resizeBrowser.bind(this);

		this.callAPI = this.callAPI.bind(this);

		this.imageController = this.imageController.bind(this);
		this.getPhotoDimensions = this.getPhotoDimensions.bind(this);
		this.addLineBreak = this.addLineBreak.bind(this);
	}

	componentWillMount() {
		window.addEventListener('resize', this.resizeBrowser.bind(this));
		let browserHeight = document.documentElement.clientHeight - 400;
		this.setState({browserHeight});
	}

	componentDidMount() {
		this.callAPI();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeBrowser.bind(this));
		this.state.displayStage = 'photos';
	}

	resizeBrowser() {
		const imagesContainerWidth = document.getElementById('app').clientWidth;
		let imagesPerRow = 0;
		switch (true) {
			case imagesContainerWidth < 992:
				imagesPerRow = 2;
				break;
			case imagesContainerWidth < 1200:
				imagesPerRow = 3;
				break;
			default:
				imagesPerRow = 3;
		}
		const imageWidth = (imagesContainerWidth - ((imagesPerRow-1) * 15)) / imagesPerRow;
		if (this.state.displayStage === "album") {
			this.setState({imagesContainerWidth, imagesPerRow, imageWidth});
		}
	}

	callAPI() {
		fetchImages().then(photoset => this.imageController(photoset));
	}

	imageController(photoSets) {
		Promise.all(photoSets.map(photoSet => {
			const photosLineBreak = this.addLineBreak(photoSet.albumPhotos);
			const photoFinal = this.getPhotoDimensions(photosLineBreak);
			return Promise.all(photoFinal).then(photoDimensions => this.addDimensionsToPhotos(photoSet.albumPhotos, photoDimensions)).then((photos) => {
				const sortImg = R.sortWith([R.ascend(R.compose(R.toUpper, R.prop('title')))]);
				const sortedPhotos = sortImg(photos);
				return {
					albumName: photoSet.albumName,
					albumDetails: {
						photo: sortedPhotos,
						visiblePhotos: sortedPhotos
					}
				}
			});
		})).then(albumSet => this.setState({
			albumSet
		}, this.resizeBrowser));
	}

	addDimensionsToPhotos(photosArray, photoDimensions) {
		const tempPhotosArray = photosArray;
		for (let i = 0; i < photoDimensions.length; i += 1) {
			const imageOrientation = (photoDimensions[i][0] > photoDimensions[i][1]
				? 'landscape'
				: 'portrait');
			tempPhotosArray[i].width = photoDimensions[i][0];
			tempPhotosArray[i].height = photoDimensions[i][1];
			tempPhotosArray[i].orientation = imageOrientation;
		}
		return tempPhotosArray;
	}

	getPhotoDimensions(photosArray) {
		const photos = [];
		function getDimensions(photoImage) {
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = () => {
					resolve([img.width, img.height]);
				};
				img.onerror = () => {
					const message = 'Could not get image dimension';
					reject(new Error(message));
				};
				img.src = photoImage.imageURL;
			});
		}
		photosArray.forEach((photo) => {
			photos.push(getDimensions(photo));
		});
		return photos;
	}

	addLineBreak(photosImages) {
		const tempPhotosImages = photosImages.map((image) => {
			const tempImage = image;
			tempImage.description = tempImage.description.replace(/\n/g, '<br>');
			return tempImage;
		});
		return tempPhotosImages;
	}

	/** ============ */

	render() {
		return (
			<div id="albumContainer">
				<div className="container">
					<h1>Albums</h1>
				</div>
				{this.state.albumSet.length === 0 ? (
					<Loading
						browserHeight={this.state.browserHeight}
         			 />
        		) : (
					<div>
						<AlbumDisplay
							albums={this.state.albumSet}
							coverSize={this.state.imageWidth}
            			/>
					</div>
				)}
				<div>
					{this.state.albumSet.length !== 0 && 
						<div className="footer">
							{"This product uses the Flickr API but is not endorsed or certified by Flickr."}
						</div>
        			}
				</div>
			</div>
		)
	}
}
