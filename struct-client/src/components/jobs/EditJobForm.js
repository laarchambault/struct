import React, { Component } from 'react'
import swal from 'sweetalert'
import JobContactAssignForm from '../contacts/JobContactAssignForm.js'
import { Form, Button } from 'semantic-ui-react'
import Loading from '../../Loading'
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
        return fetch(`http://localhost:3000/jobs/${jobId}/contacts`, {
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
        const id = this.props.currentJob.id
        fetchEditJob(id, this.state)
        .then(job => {
            const newJobs = [...this.props.jobs]
            const i = newJobs.findIndex(listedJob => listedJob.id === job.id)
            newJobs[i] = job
            this.props.updateJobs(newJobs)
            if(this.state.checkedContacts.length > 0) {
                fetchAssignContactsToJob({checkedContacts: this.state.checkedContacts}, job.id)
                .then(r => {
                    this.props.history.push(`/jobs/${job.id}`)
                })
                .catch(error => swal({
                    title: "Unable to show updates. Please refresh page",
                    icon: "error"
                }))
            }
            
        })
    }

    componentDidMount = () => {
        this.props.toggleLoad()
        const job = this.props.currentJob
        this.setState({
            id: job.id,
            name: job.name,
            street_address: job.street_address,
            city: job.city,
            state: job.state
        })
        this.getContactsForThisJob(job.id)
        .then(jobPermissions => {
            this.setState({checkedContacts: jobPermissions})
            this.props.toggleLoad()
        })
        .catch(() => this.props.toggleLoad())
    }

    dropdownValue = (contact_id) => {
        if (this.state.checkedContacts.length > 0) {
            const contactObj = this.state.checkedContacts.find( c => c.user_id === contact_id)
            if (contactObj && contactObj.permission) {
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
            <>
                {this.props.loading ? <Loading /> : 
                    <div>
                    <h1 className='page-header'>Enter Job Details</h1>
                        <Form onSubmit={this.handleSubmit} autocomplete="off">
                            <Form.Field>
                                <label> Job Name</label>
                                <input type='text' value={this.state.name} name="name" onChange={this.handleChange}/>
                            </Form.Field>
                        <br/>
                        <Form.Group >
                            <Form.Field width='4'>
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
                }
            </>  
            
        )
    }
}

const mapStateToProps = state => {
    return { 
        jobs: state.jobs,
        contacts: state.contacts,
        currentJob: state.currentJob,
        loading: state.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateJobs: jobs => dispatch({type: 'UPDATE_JOBS', jobs: jobs}),
        toggleLoad: () => dispatch({type: 'TOGGLE_LOADING'})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditJobForm)