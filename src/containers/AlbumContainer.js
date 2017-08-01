import React, {Component} from 'react';
import R from 'ramda';
import fetchImages from '../utils/Api';
import Loading from '../components/Loading';
import AlbumDisplay from '../components/AlbumDisplay';

export default class GalleryContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			albumSet: [],
			browserHeight: 0,
			albumContainerWidth: 0,
			imageAlbumWidth: 0,
			albumImagesPerRow: 0,
		};
		this.albumResizeBrower = this.albumResizeBrower.bind(this);

		this.callAPI = this.callAPI.bind(this);

		this.imageController = this.imageController.bind(this);
		this.getPhotoDimensions = this.getPhotoDimensions.bind(this);
		this.addLineBreak = this.addLineBreak.bind(this);
	}

	componentWillMount() {
		window.addEventListener('resize', this.albumResizeBrower);
		let browserHeight = document.documentElement.clientHeight - 400;
		this.setState({browserHeight});
	}

	componentDidMount() {
		this.callAPI();
	}

	albumResizeBrower() {
		const albumContainerWidth = document.getElementById('app').clientWidth;
		let albumImagesPerRow = 0;
		switch (true) {
			case albumContainerWidth < 992:
				albumImagesPerRow = 2;
				break;
			case albumContainerWidth < 1200:
				albumImagesPerRow = 3;
				break;
			default:
				albumImagesPerRow = 3;
		}
		const imageAlbumWidth = (albumContainerWidth - (albumImagesPerRow * 5)) / albumImagesPerRow;
		this.setState({albumContainerWidth, albumImagesPerRow, imageAlbumWidth});
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
		}, this.albumResizeBrower));
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
			<div>
        <div className="container">
          <h1>Albums</h1>
        </div>
				{this.state.albumSet.length === 0
					? (
            <Loading
            browserHeight={this.state.browserHeight}
          />
        ) : (
						<div>
							<AlbumDisplay
                albums={this.state.albumSet}
                coverSize={this.state.imageAlbumWidth}
              />
						</div>
					)}
				<div>
					{this.state.albumSet.length !== 0 && <div className="footer">
						{"This product uses the Flickr API but is not endorsed or certified by Flickr."}
					</div>
        }
				</div>
			</div>
		)
	}
}
