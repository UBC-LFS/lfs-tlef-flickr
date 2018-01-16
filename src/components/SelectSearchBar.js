import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

const SelectSearchBar = (props) => {
  const logChange = (val) => {
    let selectString = ''
    let returnString = ''
    if (val.length === 0) {
      props.onSelectChange('')
    } else {
      for (const key in val) {
        selectString += val[key]['value'] + ','
      }
      returnString = selectString.substring(0, selectString.length - 1)
      props.onSelectChange(returnString)
    }
  }

  return (
    <div>
      <Select
        className='select-search'
        name='form-field-name'
        options={props.selectOptions}
        onChange={logChange}
        multi
        joinValues={false}
        clearable
        deleteRemoves
        value={props.currentSearch}
      />
    </div>
  )
}

SelectSearchBar.propTypes = {
  currentSearch: PropTypes.string.isRequired,
  onSelectChange: PropTypes.func.isRequired,
  selectOptions: PropTypes.array.isRequired
}

export default SelectSearchBar
