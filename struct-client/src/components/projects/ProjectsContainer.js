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
        const { permission } = this.props.job
        return(
            <div>
                <Button onClick={this.backToJobs}>Back to All Jobs</Button>
                { permission === 1 || permission === 2 ?
                    <NavLink to={`/jobs/${this.props.match.params.id}/edit`}>
                        <Button>Edit Job Details</Button>
                    </NavLink>
                : null }
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