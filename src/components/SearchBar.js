import React, { PropTypes } from 'react';
import SearchInput from 'react-search-input';

const SearchBar = props => (
  <div>
    <SearchInput className="search-input"
      onChange={props.onSearchChange}
    />
  </div>
);

SearchBar.propTypes = {
  onSearchChange: PropTypes.func.isRequired,
};

export default SearchBar;
