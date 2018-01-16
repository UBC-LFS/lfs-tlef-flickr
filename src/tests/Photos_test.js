/* global describe, it */
import React from 'react'
import { expect } from 'chai'
import { mount } from 'enzyme'
import Photos from '../components/Photos'

describe('<Photos />', () => {
  it('should have an element with id="container"', () => {
    const wrapper = mount(<Photos />)
    expect(wrapper.find('#container').to.have.length(1))
  })
})
