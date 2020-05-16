import React, { Component } from 'react'
import JobCard from './JobCard'
import { Grid } from 'semantic-ui-react'

// import { connect } from 'react-redux'

class ViewJobs extends Component {
    state={
        view: 'all'
    }
    render() {
        return(
            <Grid>
                {this.props.jobs.map(job => <JobCard job={job} key={job.id}/>)}
            </Grid>
            
        )
    }
}

export default ViewJobs