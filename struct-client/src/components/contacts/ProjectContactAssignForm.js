import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { permissionOptions, subPermissionOptions } from './contactHelpers'

class ContactAssignInput extends Component {
    render() {
        let {f_name, l_name, id} = this.props.contact
        let { handleChange, permission, value } = this.props

        return(
            <>
            <h4>{f_name} {l_name}</h4>
            <Dropdown
                placeholder={`Give ${f_name} permission`}
                fluid
                selection
                options={permission === 3 ? subPermissionOptions(id) : permissionOptions(id) }
                onChange={handleChange}
                value={value}
            />
            </>
            
        )
    }
}

export default ContactAssignInput