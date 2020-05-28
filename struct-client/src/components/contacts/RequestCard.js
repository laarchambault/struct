import React from 'react'
import { Card, Button, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { fetchContactsAndSetState } from './contactHelpers'

class RequestCard extends React.Component {
    
    handleClick = e => {

        let response;
        if(e.target.classList.contains('add')) {
            response = 'add'
        } else if(e.target.classList.contains('delete')) {
            response = 'delete'
        }
        fetch(`http://localhost:3000/contacts/${this.props.contact.id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({response: response})
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
            .then(contactObj => {
                this.props.setApprovedAndRequestContacts(contactObj)
                fetchContactsAndSetState(this.props.addContacts)
            })
            
        })
        .catch(console.error)
    }

    render() {
        let {f_name, l_name, email, company} = this.props.contact
    
        return (
            <Card>
                <Card.Content>
                    <Button.Group floated='right'>
                        <Button onClick={this.handleClick} positive icon className={'add'}>
                            <Icon name='add user' />
                        </Button>
                        <Button onClick={this.handleClick} negative icon className={'delete'}>
                            <Icon name='user delete' />
                        </Button>
                    </Button.Group>
                    <Card.Header textAlign='left' as='h2'>{f_name + " " + l_name}</Card.Header>
                    <Card.Description textAlign='left'>
                        <strong>{email}</strong>
                    </Card.Description><br/><br/>
                    <Card.Header as='h3'>Company: {company}</Card.Header>
                </Card.Content>
            </Card>
        )
    }
}

const mapStateToProps = state => {
    return {
        contacts: state.contacts
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addContacts: contacts => dispatch({type: 'SET_CONTACTS', contacts})
    }
    
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestCard)