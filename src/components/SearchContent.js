import React from 'react';

const optionTop = ['default', 'number', 'alphabet', 'animal'];
const optionBot = {
    default: [],
    number: ['', '1', '2', '3'],
    alphabet: ['', 'a', 'b', 'c'],
    animal: ['', 'pug', 'panda', 'corgi']
}


export default class SearchContent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchBarObject: '',
            searchDropdownTopObject: 'default',
            searchDropdownBotObject: ''
        }
        this.searchBarHandleChange = this.searchBarHandleChange.bind(this)
        this.submit = this.submit.bind(this)
        this.searchDropdownTopChange = this.searchDropdownTopChange.bind(this)
        this.searchDropdownBotChange = this.searchDropdownBotChange.bind(this)
    }

    searchDropdownTopChange(event) {
        this.setState({searchDropdownTopObject: event.target.value,
                       searchDropdownBotObject: '',
                       searchBarObject: '' });
        this.props.onUpdateSearchBar(event.target.value);
    }

    searchDropdownBotChange(event) {
        this.setState({searchDropdownBotObject: event.target.value,
                       searchBarObject: '' });
        this.props.onUpdateSearchBar(event.target.value + this.state.searchDropdownTopObject);
    }

    searchBarHandleChange(event) {
        this.setState({searchBarObject: event.target.value});
    }

    submit(event) {
        event.preventDefault();
        this.props.onUpdateSearchBar(this.state.searchBarObject)
    }

    render() {
        return (
            <form onSubmit={this.submit} 
                  id="search-form"
                  className="search-content-form">
                <div>
                    <select id="searchDropdownTop"
                            onChange={this.searchDropdownTopChange} >
                        {optionTop.map((opt, i) =>
                            (i == '0') ?
                            <option key={i}
                                    value={opt} >
                            </option> :
                            <option key={i}
                                    value={opt} >
                                {opt}
                            </option>
                        )}
                    </select>
                    <select id="searchDropdownBottom"
                            value={this.state.searchDropdownBotObject}
                            onChange={this.searchDropdownBotChange} >
                        {optionBot[this.state.searchDropdownTopObject].map((opt, i) => 
                            <option key={i}
                                    value={opt}>
                                {opt}
                            </option>)}
                    </select>
                </div>
                <input id="searchBar" 
                       type="text"
                       placeholder="Search..."
                       value={this.state.searchBarObject}
                       onChange={this.searchBarHandleChange} />
                <input type="submit"
                       value="Search" />
            </form>
        )
    }
}