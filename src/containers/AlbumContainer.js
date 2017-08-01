import React, { Component } from 'react';
import Lightbox from 'react-images';
import { Link } from 'react-router-dom';
import R from 'ramda';
import fetchImages from '../utils/Api';
import Photos from '../components/Photos';
import Loading from '../components/Loading';
import AlbumDisplay from '../components/AlbumDisplay';

export default class GalleryContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albumSet: [],
      browserHeight: 0,
      imagesContainerWidth: 0,
      imageWidth: 0,
      imagesPerRow: 0,
      selectSearch: '',
      wordSearch: '',
      displayStage: 'album',
      photos: [],
      visiblePhotos: [],
      allSelectOptions: [],
      currentSelectOptions: [],
      currentImage: 0,
      lightboxIsOpen: false,
      thumbnails: true,
    };
    this.resizeBrowser = this.resizeBrowser.bind(this);

    this.callAPI = this.callAPI.bind(this);

    this.imageController = this.imageController.bind(this);
    this.fetchTags = this.fetchTags.bind(this);
    this.setUniqueTags = this.setUniqueTags.bind(this);
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
    this.scrollController = this.scrollController.bind(this);
    this.imageSizer = this.imageSizer.bind(this);

    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.filterSelectPhotos = this.filterSelectPhotos.bind(this);
    this.isSelectMatchingTag = this.isSelectMatchingTag.bind(this);
    this.updateSearchTagOptions = this.updateSearchTagOptions.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', this.resizeBrowser);
    let browserHeight = document.documentElement.clientHeight - 400;
    this.setState({browserHeight});
  }

  componentDidMount() {
    this.callAPI();
  }

  /**
  * resizeBrowser
  */
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
  imageController(photoSets) {
    console.log("controller: ", photoSets)
    Promise.all(
      photoSets.map(photoSet => {
        const uniqueTags = this.fetchTags(photoSet.albumPhotos);
        const allSelectOptions = this.setUniqueTags(photoSet.albumPhotos, uniqueTags);
        const photosLineBreak = this.addLineBreak(photoSet.albumPhotos);
        const photoFinal = this.getPhotoDimensions(photosLineBreak);
        return Promise.all(photoFinal)
        .then(photoDimensions => this.addDimensionsToPhotos(photoSet.albumPhotos, photoDimensions))
        .then((photos) => {
          const sortImg = R.sortWith([R.ascend(R.compose(R.toUpper, R.prop('title')))]);
          const sortedPhotos = sortImg(photos);
          return {
                  albumName: photoSet.albumName,
                  albumDetails: {
                    photo: sortedPhotos,
                    allSelectOptions,
                    currentSelectOptions: allSelectOptions,
                    visiblePhotos: sortedPhotos,
                  }
                 }
          // this.setState({
          //   photos: sortedPhotos,
          //   allSelectOptions,
          //   currentSelectOptions: allSelectOptions,
          //   visiblePhotos: sortedPhotos,
          // }, this.resizeBrowser);
        });
      })
    )
      .then(albumSet => this.setState({albumSet}, this.resizeBrowser));
  }

  /**
  * NOTE: Flickr API returns tags as an appended string
  * Fetch all unique tags from the photo set
  * @param {array} photoSet - array of photo objects
  */
  fetchTags(photoSet) {
    const uniqueTags = new Set();
    photoSet.forEach((photoObj) => {
      photoObj.tags.split(' ').forEach(tag => {
        if(tag !== '') {
          uniqueTags.add(tag);
        }
      })
    });
    return [...(uniqueTags)].sort();
  }

  /**
  * Creates an array of unique tag objects, sorted in descending order
  * @param {array} photoSet - array of photo objects
  * @param {array} uniqueTags - array of tags that are string
  * @return {array} - array of tag objects
  */
  setUniqueTags(photoSet, uniqueTags) {
    const tags = uniqueTags.map(tag => ({ value: tag, label: tag, count: 0 }));
    const duplicateTags = [];
    photoSet.forEach((photoObj) => {
      photoObj.tags.split(' ').forEach(tag => (
        duplicateTags.push(tag)
      ));
    });
    tags.forEach((uniqueTag) => {
      uniqueTag.count = duplicateTags.reduce((acc, tag) => {
        if (tag === uniqueTag.value) {
          acc += 1;
        }
        return acc;
      }, 0);
    });
    const sortTags = R.sortWith([R.descend(R.prop('count'))]);
    return sortTags(tags);
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
    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return w >= 1680 ? true : false
  }

  scrollController() {
    (this.state.lightboxIsOpen === true)
      ? (document.body.style.overflowY = "hidden")
      : (document.body.style.overflowY = "visible")
  }

  imageSizer() {
    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    if ((w > 1600) && (h > 1000)) {
      return 1024
    }

    if ((w > 1400) && (h > 500)) {
      return 700
    }

    if ((w > 500) && (h > 500)) {
      return 550
    }

    if (w > 650 && (h < 500)) {
      return 330
    }

    if (w <= 1000) {
      return 250
    }
  }

  /** ============ */

  /**
   * React-Select Functions
   * ============
  */
  handleSelectChange(searchTerm) {
    (searchTerm !== '')
      ? (this.setState({ selectSearch: searchTerm }, this.filterSelectPhotos))
      : (this.setState({ selectSearch: searchTerm }, this.filterByTerm));
  }

  filterSelectPhotos() {
    let matchedImages = this.state.photos.filter(this.isSelectMatchingTag);
    if (((this.state.wordSearch === '' && this.state.selectSearch === '') || this.state.selectSearch === '')) {
      matchedImages = this.state.photos;
    }
    const updatedSearchOptions = this.updateSearchTagOptions();
    const updatedCurrentSearchOptions = this.state.allSelectOptions.filter(tag => updatedSearchOptions.includes(tag.value))
    this.setState({ visiblePhotos: matchedImages, currentSelectOptions: updatedCurrentSearchOptions }, this.handleMultiSearch);
  }

  isSelectMatchingTag(image) {
    const tags = image.tags.split(' ');
    const selectSearchSplit = this.state.selectSearch.split(',');
    for (let i = 0; i < selectSearchSplit.length; i += 1) {
      if (!tags.includes(selectSearchSplit[i])) {
        return false;
      }
    }
    return true;
  }

  updateSearchTagOptions() {
    let otherSearchOptions = [];
    const searchTags = ((this.state.selectSearch === '') ? [] : this.state.selectSearch.split(','));
    if (searchTags.length === 0) {
      otherSearchOptions = this.fetchTags(this.state.photos);
    } else {
      this.state.photos.map((photo) => {
        let tagTest = true;
        const photoTags = photo.tags.split(' ');
        if (photoTags.length > searchTags.length) {
          for (let i = 0; i < searchTags.length; i += 1) {
            if (!photoTags.includes(searchTags[i])) {
              tagTest = false;
              break;
            }
          }
          if (tagTest === true) {
            for (let i = 0; i < photoTags.length; i += 1) {
              if (!searchTags.includes(photoTags[i]) && !otherSearchOptions.includes(photoTags[i])) {
                otherSearchOptions.push(photoTags[i]);
              }
            }
          }
        }
        return photo;
      });
      otherSearchOptions.push(...searchTags);
    }
    return otherSearchOptions;
  }

  /** ============ */

  render() {
    return (
      <div>
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
