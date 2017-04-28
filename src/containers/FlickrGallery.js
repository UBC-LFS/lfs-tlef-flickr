import React from 'react';
import SearchContent from '../components/SearchContent';
import Photos from '../components/Photos';

export default class FlickrGallery extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchContentResult: ''
        }
        this.updateSearchBarResult = this.updateSearchBarResult.bind(this)
    }

    updateSearchBarResult(searchbarResult) {
        this.setState({searchContentResult: searchbarResult});
    }
    

    render() {
        return (
            <div className="flickr-gallery">
                <SearchContent onUpdateSearchBar={this.updateSearchBarResult}
                               onUpdateSearchDropdown={this.updateSearchDropdownResult} />

            </div>
        )
    }
}