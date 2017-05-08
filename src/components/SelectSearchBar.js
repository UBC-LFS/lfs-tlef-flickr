import React, { PropTypes } from 'react';
import Select from 'react-select';

const SelectSearchBar = (props) => {

    const logChange = val => {
        let selectString = '';
        let returnString = '';
        if (val.length === 0)
        {
            props.onSelectChange('');
        }
        else
        {
            for (var key in val) {
                selectString += val[key]["value"] + ',';
            }
            let returnString = selectString.substring(0, selectString.length-1);
            props.onSelectChange(returnString);
        }
    }

    return(
        <div>
            <Select 
                name="form-field-name"
                options={props.selectOptions}
                onChange={logChange}
                multi={true}
                joinValues={false}
                clearable={true}
                deleteRemoves={true}
                value={props.currentSearch}
            />
        </div>
    )
}

export default SelectSearchBar