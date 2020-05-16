import React, { Component } from 'react'
import ViewJobs from './ViewJobs'
import NewJob from './NewJob'
import { connect } from 'react-redux'

class JobsContainer extends Component {
    state={
        view: true,
    }

    componentDidMount() {
        fetch(`http://localhost:3000/users/${this.props.userId}`, {
            credentials: 'include'
        })
        .then(r => {
            if(r.ok) {
                return r.json()
            } else {
                throw r
            }
        })
        .then(user => {
            this.props.updateJobs(user.jobs)
        })
    }

    toggleView = () => {
        this.setState({ view: !this.state.view})
    }

    addJob = job => {
        const newJobs = [...this.props.jobs, job]
        this.props.updateJobs(newJobs)
        this.setState({view: true})
    }

    render() {
        return(
            <div>
                <button onClick={this.toggleView}>{ this.state.view? "Create Job" : "Return to All Jobs"}</button>
                { this.state.view ? 
                    <ViewJobs userId={this.props.userId} jobs={this.props.jobs}/> 
                : 
                    <NewJob userId={this.props.userId} addJob={this.addJob}/>}
            </div>
            
        )

    }
}

const mapStateToProps = state => {
    return {
        userId: state.currentUser,
        jobs: state.jobs
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateJobs: jobs => dispatch({type: 'UPDATE_JOBS', jobs: jobs})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobsContainer)