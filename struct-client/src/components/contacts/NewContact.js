

import React from 'react'
import {Input} from 'semantic-ui-react'

class NewContact extends React.Component {

    state = {email: ''}

    handleChange = e => {
        this.setState({ email: e.target.value })
    }

    handleEnter = e => {
        if(e.key === 'Enter') {
            fetch('http://localhost:3000/contacts', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.state)
            })
            .then(r => {
                if(r.ok) {
                    return r.json()
                } else {
                    throw r
                }
            })
            .then(r => {

                alert(r.msg)
                this.props.hideNewContactForm()
            })
            .catch(console.error)
        }
    }
    render() {
        return (
            <>
                <h1>Enter Email to send Contact Request</h1>
                <Input 
                    onKeyPress={this.handleEnter} 
                    onChange={this.handleChange}
                    icon='users' 
                    iconPosition='left' 
                    placeholder='Enter email...' 
                    />
                    {/* TODO: add submit button instead of relying on enter key */}
            </>
        )
    }
    
}

export default NewContact