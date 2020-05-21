import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { fetchCreateJob, fetchAssignContactsToJob } from './fetches'
import ContactAssignInput from '../contacts/ContactAssignInput.js'


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
            return obj.user_id === u_id
        })
        const newContact = {user_id: u_id, permission: permiss}
            if( i < 0 ) {
                updCheckedContacts.push(newContact)
            } else {
                if(permiss === '4') {
                    updCheckedContacts.splice(i, 1)
                } else {
                    updCheckedContacts[i] = newContact
                }
            }
            this.setState({
                ...this.state,
                checkedContacts: updCheckedContacts
            })
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
                    <h2>Add Users to This Job </h2>
                    <h2><em>set permissions for viewing/editing</em></h2>
                    <h4><em>Builder: full view/edit permissions</em></h4>
                    <h4><em>Subcontractor: view/edit own projects, permitted fields only. Can view public fields</em></h4>
                    <h4><em>Viewer: view-only permission for public details</em></h4>
                    {this.props.contacts.map(contact => <ContactAssignInput contact={contact} handleChange={this.handleContactChange} checkedContacts={this.state.checkedContacts}/>)}
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