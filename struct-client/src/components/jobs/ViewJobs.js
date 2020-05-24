import React, { Component } from 'react'
import JobCard from './JobCard'
import { Grid } from 'semantic-ui-react'

// import { connect } from 'react-redux'

class ViewJobs extends Component {

    render() {
        return(
            <>
            {this.props.jobs.length === 0 ?
                <>
                <h3>No Jobs Yet</h3>
                <h4><em>Create a job to get started working</em></h4>
                </>
            :
                <>
                    <h2>All Jobs</h2>
                    <Grid>
                        {this.props.jobs.map(job => <JobCard job={job} key={job.id}/>)}
                    </Grid>
                </>
            }
            </>
            
            
        )
    }
}

export default ViewJobs