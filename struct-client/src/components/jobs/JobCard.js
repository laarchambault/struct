import React, { Component } from 'react'
import { Card, Button, Icon } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import swal from 'sweetalert'
import { connect } from 'react-redux'
import { fetchJobsAndSetState } from './fetches'


class JobCard extends Component {

    handleClick = e => {
        if(e.target.nodeName === "I" || e.target.nodeName === "BUTTON") {
            this.handleDelete()
        } else {
            this.props.setCurJob(this.props.job)
        this.props.history.push(`/jobs/${this.props.job.id}`)
        }
    }

    handleDelete = () => {
        this.props.toggleLoad()
        const jobId = this.props.job.id
        fetch(`http://localhost:3000/jobs/${jobId}/delete`, {
            credentials: "include"
        })
        .then(r => {
            if(r.ok) {
                return r.json()
            } else {
                throw r
            }
        })
        .then( response => {
            swal({
                title: "Job deleted",
                icon: "success"
            })
            fetchJobsAndSetState(this.props.userId, this.props.toggleLoad, this.props.updateJobs)
        })
        .catch(error =>
            swal({
                title: error.msg,
                icon: "error"
            }))
    }

    render() {
        return(
            <Card onClick={this.handleClick}>
                <Card.Content>
                    <Card.Header textAlign='right'>{this.props.job.name}</Card.Header>
                    <Card.Description textAlign='left'>
                        <p><strong>Address: </strong>{this.props.job.street_address}</p>
                        <p><strong>City: </strong>{this.props.job.city}</p>
                        <p><strong>State: </strong>{this.props.job.state}</p>
                    </Card.Description>
                    { this.props.job.permission === 1 ? 
                    <Button icon color='red' floated='right' size='tiny'>
                        <Icon name='delete' />
                    </Button>
                    : null}
                </Card.Content>
            </Card>
        )
    }
}

const mapStateToProps = state => {
    return {
        userId: state.currentUser,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateJobs: jobs => dispatch({type: 'UPDATE_JOBS', jobs: jobs}),
        toggleLoad: () => dispatch({type: 'TOGGLE_LOADING'}),
        setCurJob: job => dispatch({type: "SET_JOB", job: job})
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(JobCard))