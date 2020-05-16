import React, { Component } from 'react'

import { connect } from 'react-redux'

class EditJobForm extends Component {
    state={
        name: '',
        street_address: '',
        city: '',
        state: ''
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = e => {
        e.preventDefault()
        fetch(`http://localhost:3000/jobs/${this.props.match.params.id}`, {
            method: 'PUT',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
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
        .then(job => {
            const newJobs = [...this.props.jobs]
            const i = newJobs.findIndex(listedJob => listedJob.id === job.id)
            newJobs[i] = job
            this.props.updateJobs(newJobs)
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

    //return job and update JobContainer state
    //and send user to /jobs/:id

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
                    <input type='submit'/>
                </form>
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return { jobs: state.jobs }
}

const mapDispatchToProps = dispatch => {
    return {
        updateJobs: jobs => dispatch({type: 'UPDATE_JOBS', jobs: jobs})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditJobForm)