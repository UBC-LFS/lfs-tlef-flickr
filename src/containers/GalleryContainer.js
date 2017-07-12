import React, { Component } from 'react';
import Lightbox from 'react-images';
import fetchImages from '../utils/Api';
import SearchBar from '../components/SearchBar';
import SelectSearchBar from '../components/SelectSearchBar';
import Photos from '../components/Photos';

export default class GalleryContainer extends Component {
  constructor() {
    super();
    this.state = {
      displayImageWidth: 0,
      selectSearch: '',
      wordSearch: '',
      photos: [],
      visiblePhotos: [],
      tempPhotos: [],
      allSelectOptions: [],
      currentSelectOptions: [],
      currentImage: 0,
      lightboxIsOpen: false,
    };
    this.callAPI = this.callAPI.bind(this);
    this.closeLightbox = this.closeLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
    this.handleClickImage = this.handleClickImage.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getLightboxImages = this.getLightboxImages.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.filterSelectPhotos = this.filterSelectPhotos.bind(this);
    this.isSelectMatchingTag = this.isSelectMatchingTag.bind(this);
    this.updateSearchTagOptions = this.updateSearchTagOptions.bind(this);
    this.setAllTags = this.setAllTags.bind(this);
    this.setUniqueTags = this.setUniqueTags.bind(this);
    this.setImageDescriptions = this.setImageDescriptions.bind(this);
    this.openThumbnail = this.openThumbnail.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.imageHover = this.imageHover.bind(this);
    this.imageUnhover = this.imageUnhover.bind(this);
    this.filterByTerm = this.filterByTerm.bind(this);
    this.resizeBrowser = this.resizeBrowser.bind(this);
    this.handleMultiSearch = this.handleMultiSearch.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeBrowser);
    this.callAPI();
  }

  // unclear why there is an initial offset which must be considered
  resizeBrowser(initialOffset) {
    const displayImageWidth = document.getElementById('images').clientWidth / 3;
    this.setState({ displayImageWidth });
  }

  callAPI() {
    fetchImages().then(photoset => this.setImageDescriptions(photoset));
  }

  setImageDescriptions(photoSet) {
    const uniqueTags = this.setAllTags(photoSet);
    const allSelectOptions = this.setUniqueTags(uniqueTags);
    this.setState({
      photos: photoSet,
      allSelectOptions,
      currentSelectOptions: allSelectOptions,
      visiblePhotos: photoSet,
    }, this.resizeBrowser);
  }

  setUniqueTags(uniqueTags) {
    return uniqueTags.map(tag => ({ value: tag, label: tag }));
  }

  setAllTags(photoSet) {
    const uniqueTags = new Set();
    photoSet.forEach((photoObj) => {
      photoObj.tags.split(' ').forEach(tag => (
        uniqueTags.add(tag)));
    });
    return [...(uniqueTags)].sort();
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
      otherSearchOptions = this.setAllTags(this.state.photos);
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

  getLightboxImages(photoSet) {
    const visiblePhotos = photoSet.map((photo) => {
      const largeImg = photo.imageURL.split('.jpg')[0].concat('_b.jpg');
      return ({ src: largeImg, caption: photo.description });
    });
    return visiblePhotos;
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

  openLightbox(index, event) {
    event.preventDefault();
    this.setState({ currentImage: index, lightboxIsOpen: true });
  }

  imageHover(index) {
    const visiblePhotos = this.state.visiblePhotos;
    visiblePhotos[index].hover = true;
    this.setState({ visiblePhotos });
  }

  imageUnhover(index) {
    const visiblePhotos = this.state.visiblePhotos;
    visiblePhotos[index].hover = false;
    this.setState({ visiblePhotos });
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

  filterByTerm() {
    const photoSet = (this.state.selectSearch === '' ? this.state.photos : this.state.visiblePhotos);
    const searchKey = this.state.wordSearch.toUpperCase();
    const matchedImages = photoSet.filter(photo => ((photo.title.toUpperCase().includes(searchKey) || photo.description.toUpperCase().includes(searchKey))));
    const updatedSearchOptions = this.updateSearchTagOptions();
    const updatedCurrentSearchOptions = this.state.allSelectOptions.filter(tag => updatedSearchOptions.includes(tag.value))
    this.setState({ visiblePhotos: matchedImages, currentSelectOptions: updatedCurrentSearchOptions });
  }

  handleMultiSearch() {
    if ((this.state.selectSearch !== '' && this.state.wordSearch !== '')) {
      this.filterByTerm();
    }
  }

  handleSelectChange(searchTerm) {
    (searchTerm !== '')
      ? (this.setState({ selectSearch: searchTerm }, this.filterSelectPhotos))
      : (this.setState({ selectSearch: searchTerm }, this.filterByTerm));
  }

  handleSearchChange(searchTerm) {
    (this.state.selectSearch !== '')
      ? (this.setState({ wordSearch: searchTerm }, this.filterSelectPhotos))
      : (this.setState({ wordSearch: searchTerm }, this.filterByTerm));
  }

  render() {
    const lightboxPhotos = this.getLightboxImages(this.state.visiblePhotos);
    return (
      <div>
        <div className="search-container">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <SearchBar
                  className="search-input"
                  onSearchChange={this.handleSearchChange}
                />
              </div>
              <div className="col-md-6">
                <SelectSearchBar
                  currentSearch={this.state.selectSearch}
                  onSelectChange={this.handleSelectChange}
                  selectOptions={this.state.currentSelectOptions}
                />
              </div>
            </div>
          </div>
        </div>
        <Photos
          _onClick={this.handleClick}
          images={this.state.visiblePhotos}
          imageWidth={this.state.displayImageWidth}
          onMouseHover={this.imageHover}
          onMouseUnhover={this.imageUnhover}
        />
        <Lightbox
          currentImage={this.state.currentImage}
          images={lightboxPhotos}
          isOpen={this.state.lightboxIsOpen}
          onClickImage={this.handleClickImage}
          onClickPrev={this.gotoPrevious}
          onClickThumbnail={this.openThumbnail}
          showThumbnails={true}
          onClickNext={this.gotoNext}
          onClose={this.closeLightbox}
        />
      </div>
    );
  }
}
