import React, { Component } from 'react';
import Dropdown from 'react-dropdown';

const options = ['number', 'alphabet', 'animal'];
const optionsAlphabet = ['a', 'b', 'c' ];
const optionsNumber = ['1', '2', '3' ];
const optionsDog = ['pug', 'corgi', 'panda']

class DropdownFilter extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedTop: "", selectedBottom: "" }
        this.onSelectBottom = this.onSelectBottom.bind(this);
        this.onSelectTop = this.onSelectTop.bind(this);
    }

    onSelectTop(option) {
        const nextState = {...this.state, selectedTop: option.label};
        this.setState(nextState);
        this.props._onSelectTop(option.value);
    }

    onSelectBottom(option) {
        const nextState = {...this.state, selectedBottom: option.label}
        this.setState(nextState);
        this.props._onSelectBottom(option.value);
    }

    render () {
        const selectedBottom = this.state.selectedBottom;
        const selectedTop= this.state.selectedTop;
        return (
            <section>
                <Dropdown options={options} onChange={this.onSelectTop} value={selectedTop} />
                {selectedTop === 'alphabet' ? (
                    <Dropdown options={optionsAlphabet} onChange={this.onSelectBottom} placeholder={'--'} value={selectedBottom} />
                ) : selectedTop === 'number' ? (
                    <Dropdown options={optionsNumber} onChange={this.onSelectBottom} placeholder={'--'} value={selectedBottom} />
                ) :  <Dropdown options={optionsDog} onChange={this.onSelectBottom} placeholder={'--'} value={selectedBottom} /> }
            </section>
        )
    }
}

export default DropdownFilter;