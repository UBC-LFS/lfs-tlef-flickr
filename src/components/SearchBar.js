import React, { PropTypes } from 'react';
import SearchInput, {createFilter} from 'react-search-input'

const SearchBar = (props) => {



  return (
        <div>
          <SearchInput className='search-input'
            onChange={props.onSearchChange}
          />
        </div>
      )
}

export default SearchBar
