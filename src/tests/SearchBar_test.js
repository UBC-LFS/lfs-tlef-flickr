import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import SearchBar from '../components/SearchBar';

describe('<SearchBar />', () => {
    it('should have an input field', () => {
        const wrapper = mount(<SearchBar />)
        expect(wrapper.find('div').to.have.length(1));
    })
})