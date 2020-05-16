import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

import ProjectWindow from './ProjectWindow'

class ProjectsContainer extends Component {

    backToJobs = () => {
        this.props.setJob(null)
        this.props.history.push('/jobs')
    }

    render() {
        return(
            <div>
                <Button onClick={this.backToJobs}>Back to All Jobs</Button>
                Hello from Projects Container
                <NavLink to={`/jobs/${this.props.match.params.id}/edit`}><Button>Edit Job Details</Button></NavLink>
                <ProjectWindow />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userId: state.currentUser,
        job: state.currentJob
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setJob: value => dispatch({type: "SET_JOB", job: value})
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectsContainer))