import React, { Component } from 'react';
//import R from 'ramda';
import Lightbox from 'react-images';
import API from '../utils/Api';
import SearchBar from '../components/SearchBar';
import SelectSearchBar from '../components/SelectSearchBar';
import Photos from '../components/Photos';

export default class GalleryContainer extends Component {
	constructor() {
		super();
		this.state = {
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
		this.searchBarKeyPress = this.searchBarKeyPress.bind(this);
		this.closeLightbox = this.closeLightbox.bind(this);
		this.gotoNext = this.gotoNext.bind(this);
		this.gotoPrevious = this.gotoPrevious.bind(this);
		this.handleClickImage = this.handleClickImage.bind(this);
		this.openLightbox = this.openLightbox.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.getLightboxImages = this.getLightboxImages.bind(this);
		this.isMatchingTag = this.isMatchingTag.bind(this);
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
	}

  componentDidMount() {
		this.callAPI();
	}

	callAPI() {
		API(this.setImageDescriptions);
	}

	setImageDescriptions(photos) {
		const uniqueTags = this.setAllTags(photos);
		const allSelectOptions = this.setUniqueTags(uniqueTags);
    this.setState({photos, allSelectOptions, currentSelectOptions: allSelectOptions, visiblePhotos: photos});
	}

	setUniqueTags(uniqueTags) {
		return uniqueTags.map(uniqueTag => {
			return { value: uniqueTag, label: uniqueTag }
		})
	}

	setAllTags(photos) {
    const uniqueTagArray = [];
    photos.map(photoArray => photoArray[3].split(' ').map(photoTag => (
      !uniqueTagArray.includes(photoTag) ? uniqueTagArray.push(photoTag) : photoTag
    )));
    return uniqueTagArray.sort();
	}

	filterSelectPhotos() {
    const matchedImages = this.state.photos.filter(this.isSelectMatchingTag);
    const updatedSearchOptions = this.updateSearchTagOptions();
    const updatedCurrentSearchOptions = this.state.allSelectOptions.filter(tag => updatedSearchOptions.includes(tag.value))
    this.setState({visiblePhotos: matchedImages, currentSelectOptions: updatedCurrentSearchOptions});
	}

	isSelectMatchingTag(image) {
		const tags = image[3].split(' ');
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
        const photoTags = photo[3].split(' ');
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

	getLightboxImages(photos) {
		const images = photos.map(img => {
			const largeImg = img[0].split('.jpg')[0].concat('_b.jpg');
			return ({src: largeImg, caption: img[5]})
		})
		return images;
	}

  closeLightbox() {
		this.setState({ currentImage: 0, lightboxIsOpen: false });
	}

	gotoPrevious() {
		this.setState({currentImage: this.state.currentImage - 1});
	}

	gotoNext() {
		this.setState({currentImage: this.state.currentImage + 1});
	}

	handleClick(index) {
		this.setState({ currentImage: index, lightboxIsOpen: true });
	}

	handleClickImage() {
		if (this.state.currentImage === this.getLightboxImages(this.state.visiblePhotos).length - 1)
			return;
		this.gotoNext();
	}

	openThumbnail(index) {
		this.setState({currentImage: index});
	}

	isMatchingTag(image) {
		const tags = image[3].split(" ");
		return tags.includes(this.state.search)
	}

	openLightbox(index, event) {
		event.preventDefault();
		this.setState({ currentImage: index, lightboxIsOpen: true });
	}

	imageHover(index) {
		const visiblePhotos = this.state.visiblePhotos;
		visiblePhotos[index][6] = true;
		this.setState({ visiblePhotos });
	}

	imageUnhover(index) {
		const visiblePhotos = this.state.visiblePhotos;
		visiblePhotos[index][6] = false;
		this.setState({ visiblePhotos });
	}

	filterByTerm() {
		const photoSet = (this.state.selectSearch === "" ? this.state.photos : this.state.visiblePhotos);
		const currWord = this.state.wordSearch.toUpperCase();
		const matchedImages = photoSet.filter(photo => (
      photo[1].toUpperCase().includes(currWord) || photo[5].toUpperCase().includes(currWord)
		));
		console.log(matchedImages);
		this.setState({ visiblePhotos: matchedImages });
	}

	handleSelectChange(searchTerm) {
		if (searchTerm === "" && this.state.wordSearch !== "") {
			console.log('mycall back');
			this.setState({selectSearch: searchTerm}, this.handleSearchChange(this.state.wordSearch));
		}else {
			this.setState({ selectSearch: searchTerm }, this.filterSelectPhotos);
		}
	}

	handleSearchChange(searchTerm) {
		if (this.state.selectSearch !== "") this.handleSelectChange(this.state.selectSearch);
		console.log(searchTerm);
		this.setState({ wordSearch: searchTerm }, this.filterByTerm);
	}

  searchBarKeyPress(e) {
    if (e.key === 'Enter') this.handleSearchChange(this.state.wordSearch);
  }

	render() {
		const lightboxPhotos = this.getLightboxImages(this.state.visiblePhotos);
		return (
			<div>
				<SearchBar
          onKeyPress={this.searchBarKeyPress}
          onSearchChange={this.handleSearchChange}/>
				<SelectSearchBar
          currentSearch={this.state.selectSearch}
          onSelectChange={this.handleSelectChange}
          selectOptions={this.state.currentSelectOptions}/>
				<Photos
          _onClick={this.handleClick}
          images={this.state.visiblePhotos}
          onMouseHover={this.imageHover}
          onMouseUnhover={this.imageUnhover}/>
				<Lightbox
          currentImage={this.state.currentImage}
          images={lightboxPhotos}
          isOpen={this.state.lightboxIsOpen}
          onClickImage={this.handleClickImage}
          onClickPrev={this.gotoPrevious}
          onClickThumbnail={this.openThumbnail}
          showThumbnails={true}
          onClickNext={this.gotoNext}
          onClose={this.closeLightbox}/>
			</div>
		)
	}
}
