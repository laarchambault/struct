import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'

class ContactAssignInput extends Component {
    render() {
        let {f_name, l_name, id} = this.props.contact
        let { handleChange, value } = this.props
        const permissionOptions = [
            {
                key: `4 ${id}`,
                text: 'None',
                value: `4 ${id}`,
            },
            {
                key: `2 ${id}`,
                text: 'Builder: view/edit everything',
                value: `2 ${id}`,
            },
            {
                key: `3 ${id}`,
                text: 'Subcontractor: view/edit some fields',
                value: `3 ${id}`,
            }           
        ]
        return(
            <>
                <Form.Dropdown
                    label={`${f_name} ${l_name}`}
                    placeholder={`Give ${f_name} permission`}
                    fluid
                    selection
                    options={permissionOptions}
                    onChange={handleChange}
                    value={value}
                    />            
            </>
            
        )
    }
}

export default ContactAssignInput