

import React from 'react'
import { Input, Form, Button } from 'semantic-ui-react'

class NewContact extends React.Component {

    state = {email: ''}

    handleChange = e => {
        this.setState({ email: e.target.value })
    }

    handleSubmit = e => {
        e.preventDefault()
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
    render() {
        return (
            <>
                <h1 className='page-header'>Enter Email to send Contact Request</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Input  
                        onChange={this.handleChange}
                        icon='users' 
                        iconPosition='left' 
                        placeholder='Enter email...' 
                        />
                    <Button type='submit'>Add</Button>
                </Form>
                
            </>
        )
    }
    
}

export default NewContact