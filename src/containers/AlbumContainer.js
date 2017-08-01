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
