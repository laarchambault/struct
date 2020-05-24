import React, { Component } from 'react'
import { connect } from 'react-redux'
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
                <h1>Enter Job Details</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Job Name:
                        <input type='text' value={this.state.name} name="name" onChange={this.handleChange}/>
                    </label><br/>
                    <label>
                        Street Address:
                        <input type='text' value={this.state.street_address} name="street_address" onChange={this.handleChange}/>
                    </label><br/>
                    <label>
                        City:
                        <input type='text' value={this.state.city} name="city" onChange={this.handleChange}/>
                    </label><br/>
                    <label>
                        State:
                        <input type='text' value={this.state.state} name="state" onChange={this.handleChange}/>
                    </label><br/>
                    { this.props.contacts.length > 0 ?
                    <>
                    <h2>Add Users to This Job </h2>
                    {this.props.contacts.map(contact => 
                        <JobContactAssignForm 
                        key={`contact ${contact.id}`}
                        contact={contact} 
                        handleChange={this.handleContactChange} 
                        checkedContacts={this.state.checkedContacts}
                        value={this.dropdownValue(contact.id)}
                        />)}
                    
                    </>
                    : null}
                    <input type='submit'/>
                </form>
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