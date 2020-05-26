import React, { Component } from 'react'
import JobCard from './JobCard'
import { Card } from 'semantic-ui-react'

// import { connect } from 'react-redux'

class ViewJobs extends Component {

    render() {
        return(
            <>
            {this.props.jobs.length === 0 ?
                <>
                <h3 className='page-header'>NO JOBS YET</h3>
                <h4><em>Create a job to get started working</em></h4>
                </>
            :
                <>
                    <h2 className={'page-header'}>ALL JOBS</h2>
                    <Card.Group stackable className='job-cards' >
                        {this.props.jobs.map(job => <JobCard job={job} key={job.id}/>)}
                    </Card.Group>
                </>
            }
            </>
            
            
        )
    }
}

export default ViewJobs