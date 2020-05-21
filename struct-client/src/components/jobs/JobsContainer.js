import React, { Component } from 'react'
import ViewJobs from './ViewJobs'
import NewJob from './NewJob'
import Loading from '../../Loading'
import { connect } from 'react-redux'

class JobsContainer extends Component {
    state={
        view: true,
    }

    componentDidMount() {
        this.props.toggleLoad()
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
            this.props.toggleLoad()
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
            <>
            {this.props.loading ? <Loading/> :
                <div>
                    <button onClick={this.toggleView}>{ this.state.view? "Create Job" : "Return to All Jobs"}</button>
                    { this.state.view ? 
                        <ViewJobs userId={this.props.userId} jobs={this.props.jobs}/> 
                    : 
                        <NewJob userId={this.props.userId} addJob={this.addJob}/>}
                </div>
            }
            </>
            
            
        )

    }
}

const mapStateToProps = state => {
    return {
        userId: state.currentUser,
        jobs: state.jobs,
        loading: state.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateJobs: jobs => dispatch({type: 'UPDATE_JOBS', jobs: jobs}),
        toggleLoad: () => dispatch({type: 'TOGGLE_LOADING'})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobsContainer)