import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'

class ContactAssignInput extends Component {
    render() {
        let {f_name, l_name, id} = this.props.contact
        let { handleChange} = this.props
        const permissionOptions = [
            {
                key: `4 ${id}`,
                text: 'None',
                value: `4 ${id}`,
            },
            {
                key: `1 ${id}`,
                text: 'Builder: view/edit everything',
                value: `1 ${id}`,
            },
            {
                key: `2 ${id}`,
                text: 'Subcontractor: view/edit some fields',
                value: `2 ${id}`,
            },
            {
                key: `3 ${id}`,
                text: 'Viewer: view-only some fields',
                value: `3 ${id}`,
            },            
        ]
        return(
            <>
            <h4>{f_name} {l_name}</h4>
            <Dropdown
                placeholder={`Give ${f_name} permission`}
                fluid
                selection
                options={permissionOptions}
                onChange={handleChange}
            />
            </>
            
        )
    }
}

export default ContactAssignInput