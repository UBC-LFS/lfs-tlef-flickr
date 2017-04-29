import React, { PropTypes } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.scss';

const SelectSearchBar = (props) => {
    // const options = [
    //     { value: 'pug', label: 'pug' },
    //     { value: 'panda', label: 'panda' },
    //     { value: 'animal', label: 'animal' }
    // ];

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
                // console.log(val[key]);
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