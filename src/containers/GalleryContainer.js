import React from 'react';
import SearchBar from '../components/SearchBar';
import SelectSearchBar from '../components/SelectSearchBar';
import API from '../API/API';
import Lightbox from 'react-images';
import Photos from '../components/Photos';
import DropdownFilter from '../components/DropdownFilter';
import R from 'ramda';

export default class GalleryContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            dropdownTop: '',
            dropdownBottom: '',
            search: '',
            selectSearch: '',
            photos: [],
            visiblePhotos: [],
            currentImage: 0,
            lightboxIsOpen: false
        };
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.closeLightbox = this.closeLightbox.bind(this);
		this.gotoNext = this.gotoNext.bind(this);
		this.gotoPrevious = this.gotoPrevious.bind(this);
		this.handleClickImage = this.handleClickImage.bind(this);
		this.openLightbox = this.openLightbox.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.getLightboxImages = this.getLightboxImages.bind(this);
        this.callAPI = this.callAPI.bind(this)
        // this.handleSelectTop = this.handleSelectTop.bind(this);
        // this.handleSelectBottom = this.handleSelectBottom.bind(this);
        // this.updateSearchTerm = this.updateSearchTerm.bind(this);
        this.filterPhotos = this.filterPhotos.bind(this);
        this.isMatchingTag = this.isMatchingTag.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.filterSelectPhotos = this.filterSelectPhotos.bind(this);
        this.isSelectMatchingTag = this.isSelectMatchingTag.bind(this);
    }

    callAPI() {
        API(this.state.search  + this.state.dropdownBottom  + this.state.dropdownTop 
              ).then(result => this.setState({photos: result}));
        // const nextState = {...this.state, search: '', dropdownTop: '', dropdownBottom: ''};
        // this.setState(nextState);
    }

    closeLightbox () {
        const nextState = {...this.state, currentImage: 0, lightboxIsOpen: false};
        this.setState(nextState);
	}

    filterPhotos() {
        const matchedImages = this.state.photos.filter(this.isMatchingTag);
        // this.setState({visiblePhotos: matchedImages, search: '', dropdownTop: '', dropdownBottom: ''});
        this.setState({visiblePhotos: matchedImages});
    }

    filterSelectPhotos() {
        const matchedImages = this.state.photos.filter(this.isSelectMatchingTag);
        this.setState({visiblePhotos: matchedImages});
    }

    isSelectMatchingTag(image) {
        const tags = image[3].split(" ");
        const selectSearchSplit = this.state.selectSearch.split(",");
        for (let i=0; i<selectSearchSplit.length; i++)
        {
            // console.log(i);
            if (!tags.includes(selectSearchSplit[i]))
            {
                return false
            }
        }
        return true
        // console.log(tags);
        // console.log(selectSearchSplit);
        // console.log(image[3])
        // console.log(this.state.selectSearch)
        // const tags = image[3].split(",");
        // return tags.includes(this.state.search)
    }

    getLightboxImages(photos) {
        const images = photos.map(img => {
                const largeImg = img[0].split('.jpg')[0].concat('_b.jpg');
                return ({src: largeImg, caption: img[2]})
        })
        return images;
    }

    gotoPrevious () {
        const nextState = {...this.state, currentImage: this.state.currentImage - 1}
        this.setState(nextState);
	}

	gotoNext () {
        const nextState = {...this.state, currentImage: this.state.currentImage + 1};
        this.setState(nextState);
	}

    handleSelectChange (searchTerm) {
        this.setState({selectSearch: searchTerm}, this.filterSelectPhotos);
        // console.log(this.state.selectSearch)
    }

    handleKeyPress(searchTerm) { 
        // this.setState({search: searchTerm + this.state.dropdownBottom  + this.state.dropdownTop});
        this.setState({search: searchTerm});
    }

    handleClick(index) {
        const nextState = {...this.state, currentImage: index, lightboxIsOpen: true};
        this.setState(nextState);
    }

    handleClickImage() {
		if (this.state.currentImage === this.getLightboxImages(this.state.visiblePhotos).length - 1) return;
		this.gotoNext();
	}

    // handleSelectTop(selectedValue) {
    //     this.setState({dropdownTop: selectedValue});
    // }

    // handleSelectBottom(selectedValue) {
    //     this.setState({dropdownBottom: selectedValue});
    // }

    isMatchingTag(image) {
        const tags = image[3].split(" ");
        return tags.includes(this.state.search)
        // const searchString = this.state.search.split(",");
        // console.log(tags);
        // let tagCheck = true;
        // for(let i = 0; i<searchString.length; i++)
        // {
        //     if (!searchString[i].includes(image)) {
        //         tagCheck = false;
        //         break;
        //     }
        // }
        // return tagCheck;
        // if(tags.includes(this.state.search || this.state.dropdownBottom || this.state.dropdownTop)) {
        //     return true;
        // }
    }

    openLightbox (index, event) {
		event.preventDefault();

        const nextState = {...this.state, currentImage: index, lightboxIsOpen: true};
        this.setState(nextState);
	}

    // updateSearchTerm() {
    //     console.log(this.state.dropdownTop + this.state.dropdownBottom);
    //     this.setState({search: this.state.dropdownTop + this.state.dropdownBottom });
    // }

    componentDidMount() {
        this.callAPI();
    }

    render() {
        const lightboxPhotos = this.getLightboxImages(this.state.visiblePhotos);
        return (
        <div>
            {/*<DropdownFilter onChange={this.updateSearchTerm} _onSelectTop={this.handleSelectTop} _onSelectBottom={this.handleSelectBottom}/>*/}
            <SelectSearchBar currentSearch={this.state.selectSearch} onSelectChange={this.handleSelectChange}/>
            {/*<SearchBar onChange={this.handleKeyPress} _onButtonClick={this.filterPhotos} _onKeyPress={this.filterPhotos} />*/}
            <Photos _onClick={this.handleClick} images={this.state.visiblePhotos}/>
            <Lightbox
                currentImage={this.state.currentImage}
                images={lightboxPhotos}
                isOpen={this.state.lightboxIsOpen}
                onClickImage={this.handleClickImage}
                onClickPrev={this.gotoPrevious}
                onClickNext={this.gotoNext}
                onClose={this.closeLightbox}/>
        </div>
        )
    }
}
