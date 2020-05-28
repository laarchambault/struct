import React from 'react'
import { connect } from 'react-redux'
import ContactCard from './ContactCard'
import RequestCard from './RequestCard'
import NewContact from './NewContact'
import { Button, Card } from 'semantic-ui-react'

class ContactWindow extends React.Component {
    state={
        request_contacts: [],
        approved_contacts: [],
        viewContactForm: false
    }

    fetchApprovedAndRequestContacts = () => {
        return fetch('http://localhost:3000/contacts', {
            credentials: 'include'
        })
        .then(r => {
            if(r.ok) {
                return r.json()
            } else {
                throw r
            }
        })
    }

    setApprovedAndRequestContacts = contactObj => {
        this.setState({
            approved_contacts: contactObj.approved_contacts,
            request_contacts: contactObj.request_contacts
        })
    }

    toggleNewContactForm = () => {
        this.setState({viewContactForm: !this.state.viewContactForm})
    }

    componentDidMount = () => {
        this.fetchApprovedAndRequestContacts()
        .then(contactObj => {
            //\/ \/ don't move this out of ContactWindow unless you pass the callback to set state
            this.setApprovedAndRequestContacts(contactObj)
        })
    }

    render() {
        return(
            <div>
                <div className='nav heading second'>
                    <Button className='left' onClick={this.toggleNewContactForm}>Add New Contact</Button>
                </div>
                {this.state.viewContactForm ? <NewContact hideNewContactForm={this.toggleNewContactForm} /> : null }
                {this.state.request_contacts.length > 0 ?
                    <>
                    <h2 className='page-header' style={{fontSize: '2em', padding: '1.5em'}}>New Contact Requests</h2>
                    <Card.Group centered>
                        {this.state.request_contacts.map(contact => 
                            <RequestCard 
                                contact={contact} 
                                updateContacts={this.fetchApprovedAndRequestContacts}
                                setApprovedAndRequestContacts={this.setApprovedAndRequestContacts}/> )}
                    </Card.Group>
                    </>
                : null}
                <h2 className='page-header' style={{fontSize: '2em', padding: '1.5em'}}>All Contacts</h2>
                <Card.Group centered>
                    {this.state.approved_contacts.map(contact => 
                        <ContactCard 
                        contact={contact} 
                        updateContacts={this.fetchApprovedAndRequestContacts}
                        setApprovedAndRequestContacts={this.setApprovedAndRequestContacts}/>)}
                </Card.Group>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ContactWindow)