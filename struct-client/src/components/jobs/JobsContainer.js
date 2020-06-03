import React, { Component } from 'react'
import ViewJobs from './ViewJobs'
import NewJob from './NewJob'
import Loading from '../../Loading'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { fetchJobsAndSetState } from './fetches'

class JobsContainer extends Component {
    state={
        viewAll: true,
    }


    componentDidMount() {
        this.props.toggleLoad()
        this.props.setCurrentJob('')
        this.props.setCurrentProject('')
        this.props.setItems([])
        this.props.setUserProjects([])
        fetchJobsAndSetState(this.props.userId, this.props.toggleLoad, this.props.updateJobs)
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
                    <div className='nav second heading'>
                        <Button className='left' onClick={this.toggleView}>{ this.state.viewAll ? "Create Job" : "Return to All Jobs"}</Button>
                    </div>
                    { this.state.viewAll ? 
                        <ViewJobs/> 
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
        toggleLoad: () => dispatch({type: 'TOGGLE_LOADING'}),
        setCurrentJob: job => dispatch({type: 'SET_JOB', job}),
        setCurrentProject: project => dispatch({type: 'SET_CURRENT_PROJECT', project}),
        setItems: items => dispatch({type: 'SET_ITEMS', items}),
        setUserProjects: projects => dispatch({type: 'SET_USER_PROJECTS', projects})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(JobsContainer)