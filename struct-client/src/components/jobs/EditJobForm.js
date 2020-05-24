import React, { Component } from 'react'
import JobContactAssignForm from '../contacts/JobContactAssignForm.js'

import { connect } from 'react-redux'
import { fetchEditJob, fetchAssignContactsToJob } from './fetches.js'

class EditJobForm extends Component {
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

    getContactsForThisJob = jobId => {
        fetch(`http://localhost:3000/jobs/${this.props.match.params.id}/contacts`, {
            credentials: 'include'
        })
        .then(r => {
            if(r.ok) {
                return r.json()
            } else {
                throw r
            }
        })
        .then(jobPermissions => {
            this.setState({checkedContacts: jobPermissions})
        })
    }

    //below method is duplicated on NewJob.js. TODO: move to fetches.js or new helper file
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
                updCheckedContacts[i] = newContact
            }
            this.setState({
                ...this.state,
                checkedContacts: updCheckedContacts
            })
    }

    handleSubmit = e => {
        e.preventDefault()
        const id = this.props.match.params.id
        fetchEditJob(id, this.state)
        .then(job => {
            const newJobs = [...this.props.jobs]
            const i = newJobs.findIndex(listedJob => listedJob.id === job.id)
            newJobs[i] = job
            this.props.updateJobs(newJobs)
            fetchAssignContactsToJob({checkedContacts: this.state.checkedContacts}, job.id)
            this.props.history.push(`/jobs/${job.id}`)
        })
        .catch(error => alert("Unable to update at this time"))

    }

    componentDidMount = () => {
        const job = this.props.jobs.find(job => job.id.toString() === this.props.match.params.id)
        this.setState({
            id: job.id,
            name: job.name,
            street_address: job.street_address,
            city: job.city,
            state: job.state
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
                    <h2>Add Users to This Job </h2>
                    {this.props.contacts.map(contact => 
                        <JobContactAssignForm 
                            contact={contact} 
                            handleChange={this.handleContactChange} 
                            checkedContacts={this.state.checkedContacts}
                            value={this.dropdownValue(contact.id)}
                            />)}
                    <input type='submit'/>
                </form>
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return { 
        jobs: state.jobs,
        contacts: state.contacts
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateJobs: jobs => dispatch({type: 'UPDATE_JOBS', jobs: jobs})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditJobForm)