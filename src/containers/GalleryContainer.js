import React, { Component } from 'react';
import Lightbox from 'react-images';
import R from 'ramda';
import fetchImages from '../utils/Api';
import Photos from '../components/Photos';
import Loading from '../components/Loading';

export default class GalleryContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      browserHeight: 0,
      imagesContainerWidth: 0,
      imageWidth: 0,
      imagesPerRow: 0,
      photos: [],
      visiblePhotos: [],
      currentImage: 0,
      lightboxIsOpen: false,
      thumbnails: true,
    };
    this.resizeBrowser = this.resizeBrowser.bind(this);

    this.callAPI = this.callAPI.bind(this);

    this.imageController = this.imageController.bind(this);
    this.getPhotoDimensions = this.getPhotoDimensions.bind(this);
    this.addLineBreak = this.addLineBreak.bind(this);

    this.getLightboxImages = this.getLightboxImages.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
    this.closeLightbox = this.closeLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.handleClickImage = this.handleClickImage.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.openThumbnail = this.openThumbnail.bind(this);
    this.thumbnailSwitcher = this.thumbnailSwitcher.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', this.resizeBrowser);
    let browserHeight = document.documentElement.clientHeight;
    this.setState({browserHeight});
  }

  componentDidMount() {
    this.callAPI();
  }

  /**
  * resizeBrowser
  */
  resizeBrowser() {
    const imagesContainerWidth = document.getElementById('images').clientWidth;
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
    const imageWidth = (imagesContainerWidth - (imagesPerRow * 5)) / imagesPerRow;
    this.setState({ imagesContainerWidth, imagesPerRow, imageWidth });
  }

  /**
  * entry point for Flickr API
  */
  callAPI() {
    fetchImages().then(photoset => this.imageController(photoset));
  }

  /**
  * fetches the necessary data to set the state of the application
  * @param {array} photoSet - array of photo objects
  */
  imageController(photoSet) {
    const photosLineBreak = this.addLineBreak(photoSet);
    const photoFinal = this.getPhotoDimensions(photosLineBreak);
    Promise.all(photoFinal)
    .then(photoDimensions => this.addDimensionsToPhotos(photoSet, photoDimensions))
    .then((photos) => {
      const sortImg = R.sortWith([R.ascend(R.compose(R.toUpper, R.prop('title')))]);
      const sortedPhotos = sortImg(photos);
      this.setState({
        photos: sortedPhotos,
        visiblePhotos: sortedPhotos,
      }, this.resizeBrowser);
    });
  }

  addDimensionsToPhotos(photosArray, photoDimensions) {
    const tempPhotosArray = photosArray;
    for (let i = 0; i < photoDimensions.length; i += 1) {
      const imageOrientation = (photoDimensions[i][0] > photoDimensions[i][1] ? 'landscape' : 'portrait');
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

  /**
   * React-Images Functions
   * ============
  */

  getLightboxImages(photoSet) {
    const visiblePhotos = photoSet.map((photo) => {
      const largeImg = photo.imageURL.split('.jpg')[0].concat('_b.jpg');
      return ({ src: largeImg, caption: photo.description });
    });
    return visiblePhotos;
  }

  openLightbox(index, event) {
    event.preventDefault();
    this.setState({ currentImage: index, lightboxIsOpen: true });
  }

  closeLightbox() {
    this.setState({ currentImage: 0, lightboxIsOpen: false });
  }

  gotoPrevious() {
    this.setState({ currentImage: this.state.currentImage - 1 });
  }

  gotoNext() {
    this.setState({ currentImage: this.state.currentImage + 1 });
  }

  handleClick(index) {
    this.setState({ currentImage: index, lightboxIsOpen: true });
  }

  handleClickImage() {
    if (this.state.currentImage === this.getLightboxImages(this.state.visiblePhotos).length - 1) {
      return;
    }
    this.gotoNext();
  }

  openThumbnail(index) {
    this.setState({ currentImage: index });
  }

  thumbnailSwitcher() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      return false;
    }
    return true;
  }

  /** ============ */

  render() {
    const lightboxPhotos = this.getLightboxImages(this.state.visiblePhotos);
    const thumbnails = this.thumbnailSwitcher();
    return (
      <div>

        {this.state.photos.length === 0 ? (
          <Loading
            browserHeight={this.state.browserHeight}
          />
        ) : (
          <Photos
            _onClick={this.handleClick}
            images={this.state.visiblePhotos}
            imageWidth={this.state.imageWidth}
            imagesPerRow={this.state.imagesPerRow}
            imagesContainerWidth={this.state.imagesContainerWidth}
          />
        )}
        <Lightbox
          currentImage={this.state.currentImage}
          images={lightboxPhotos}
          isOpen={this.state.lightboxIsOpen}
          onClickImage={this.handleClickImage}
          onClickPrev={this.gotoPrevious}
          onClickThumbnail={this.openThumbnail}
          showThumbnails={thumbnails}
          onClickNext={this.gotoNext}
          onClose={this.closeLightbox}
        />
      </div>
    );
  }
}
