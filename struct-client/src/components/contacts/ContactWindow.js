import React from 'react'
import ContactCard from './ContactCard'
import RequestCard from './RequestCard'
import NewContact from './NewContact'
import { Button } from 'semantic-ui-react'

class ContactWindow extends React.Component {
    state={
        request_contacts: [],
        approved_contacts: [],
        viewContactForm: false
    }

    fetchContactsAndSetState = () => {
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
        .then(contactObj => {
            //don't move this out of ContactWindow unless you pass the callback to set state
            this.setState({
                approved_contacts: contactObj.approved_contacts,
                request_contacts: contactObj.request_contacts
            })
        })
    }

    toggleNewContactForm = () => {
        this.setState({viewContactForm: !this.state.viewContactForm})
    }
    componentDidMount = () => {
        this.fetchContactsAndSetState()
    }

    render() {
        return(
            <div>
                <Button onClick={this.toggleNewContactForm}>Add New Contact</Button>
                {this.state.viewContactForm ? <NewContact hideNewContactForm={this.toggleNewContactForm} /> : null }
                {this.state.request_contacts.length > 0 ?
                    <>
                    <h1>New Contact Requests</h1>
                    {this.state.request_contacts.map(contact => <RequestCard contact={contact} updateContacts={this.fetchContactsAndSetState}/> )}
                    </>
                : null}
                <h1>All Contacts</h1>
                {this.state.approved_contacts.map(contact => <ContactCard contact={contact} updateContacts={this.fetchContactsAndSetState}/>)}
            </div>
        )
    }

}

export default ContactWindow