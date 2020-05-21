import React from 'react'
import { Card, Button } from 'semantic-ui-react'

class ContactCard extends React.Component {

    handleDelete = () => {
        //fetch, response and catch are almost identical to RequestCard handleClick
        //TODO: refactor with RequestCard fetch
        fetch(`http://localhost:3000/contacts/${this.props.contact.id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({response: 'delete'})
        })
        .then(r => {
            if(r.ok) {
                return r.json()
            } else {
                throw r
            }
        })
        .then(r => {
            this.props.updateContacts()
        })
        .catch(console.error)
    }
    render() {
        let {f_name, l_name, email, phone, company, company_phone, company_email} = this.props.contact
    
        return (
            <Card>
                <Card.Content>
                    <Card.Header as='h2' textAlign='right'>{f_name + " " + l_name}</Card.Header>
                    <Card.Description>
                        <strong>{phone}</strong><br/>
                        <strong>{email}</strong>
                    </Card.Description><br/><br/>
                    <Card.Header as='h3' textAlign='right'>Company: {company}</Card.Header>
                    <Card.Description>
                        {company_phone}<br/>
                        {company_email}
                    </Card.Description><br/><br/>
                    <Button onClick={this.handleDelete}>Remove Contact</Button>
                </Card.Content>
            </Card>
        )
    }
}

export default ContactCard