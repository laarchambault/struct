import React, { Component } from 'react'
import ViewJobs from './ViewJobs'
import NewJob from './NewJob'
import Loading from '../../Loading'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'

class JobsContainer extends Component {
    state={
        viewAll: true,
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
        this.setState({ viewAll: !this.state.viewAll})
    }

    addJob = job => {
        const newJobs = [...this.props.jobs, job]
        this.props.updateJobs(newJobs)
        this.setState({viewAll: true})
    }

    render() {
        return(
            <>
            {this.props.loading ? <Loading/> :
                <div>
                    <Button onClick={this.toggleView}>{ this.state.viewAll ? "Create Job" : "Return to All Jobs"}</Button>
                    { this.state.viewAll ? 
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