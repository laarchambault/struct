import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Button } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { fetchCreateJob, fetchAssignContactsToJob } from './fetches'
import JobContactAssignForm from '../contacts/JobContactAssignForm.js'


class NewJob extends Component {
    state={
        name: '',
        street_address: '',
        city: '',
        state: '',
        checkedContacts: []
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = e => {
        e.preventDefault()
        fetchCreateJob({...this.state, permission: 1})
        .then(job => {
            fetchAssignContactsToJob({checkedContacts: this.state.checkedContacts}, job.id)
            this.props.addJob(job)
            this.props.history.push('/jobs')
        })
        .catch(error => alert(error))
        
    }

    handleContactChange = (e, { value }) => {
        const arr = value.split(' ')
        const permiss = arr[0]
        const u_id = arr[1]
        const updCheckedContacts = [...this.state.checkedContacts]
        const i = updCheckedContacts.findIndex(obj => {
            return obj.user_id === parseInt(u_id, 10)
        })
        const newContact = {user_id: parseInt(u_id, 10), permission: parseInt(permiss, 10)}
            if( i < 0 ) {
                updCheckedContacts.push(newContact)
            } else {
                updCheckedContacts[i] = newContact
            }
            this.setState({
                ...this.state,
                checkedContacts: updCheckedContacts
            })
    }

    dropdownValue = (contact_id) => {
        if (this.state.checkedContacts.length > 0) {
            const contactObj = this.state.checkedContacts.find( c => c.user_id === contact_id)
            if (contactObj) {
                return contactObj.permission + ' ' + contactObj.user_id
            } else {
                return `4 ${contact_id}`
            }
        } else {
            return `4 ${contact_id}`
        }
        
    }
    

    render() {
        return(
            <div>
                <h1 className='page-header'>Enter Job Details</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <label> Job Name</label>
                        <input type='text' value={this.state.name} name="name" onChange={this.handleChange}/>
                    </Form.Field>
                    <br/>
                    <Form.Group >
                        <Form.Field width='5'>
                            <label>Street Address</label>
                            <input type='text' value={this.state.street_address} name="street_address" onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field width='3'>
                            <label>City</label>
                            <input type='text' value={this.state.city} name="city" onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field width='2'>
                            <label>State</label>
                        <input type='text' value={this.state.state} name="state" onChange={this.handleChange}/>
                        </Form.Field>
                    </Form.Group>
                    <br/>
                    <br/>
                    <br/>
                    { this.props.contacts.length > 0 ?
                    <>
                    <h2 className='page-header' style={{fontSize: '2em', padding: '1.5em'}}>Add Users to This Job </h2>
                    <Form.Group>
                    {this.props.contacts.map(contact => 
                        <JobContactAssignForm 
                        key={`contact ${contact.id}`}
                        contact={contact} 
                        handleChange={this.handleContactChange} 
                        checkedContacts={this.state.checkedContacts}
                        value={this.dropdownValue(contact.id)}
                        />)}
                    </Form.Group>
                    </>

                    : null}
                    <Button type='submit'>Submit</Button>
                </Form>
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        contacts: state.contacts
    }
}


export default withRouter(connect(mapStateToProps)(NewJob))