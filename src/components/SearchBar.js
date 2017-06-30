import React, { PropTypes } from 'react';
import Select from 'react-select';

const SearchBar = (props) => {

    const handleClick = () => {
        props._onButtonClick();
    }

    const handleChange = e => {
        props.onChange(e.target.value);
    }

    const handleEnterKey = e => {
        if (e.key === 'Enter') {
            props._onButtonClick();
            console.log(e.key);
        }
    }

    return (
        <div>
            <input 
                className="searchBar" 
                placeholder="Search by tags" 
                onChange={handleChange}
                onKeyPress={handleEnterKey}
            />
            <button 
                id="searchButton"
                onClick={handleClick} > Search 
            </button> 
        </div>
    )
}

SearchBar.propTypes = {
    onChange: PropTypes.func.isRequired,
    _onButtonClick: PropTypes.func.isRequired,
    _onKeyPress: PropTypes.func.isRequired
}

export default SearchBar