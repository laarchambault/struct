import React, { Component } from 'react'
import { Card } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'

import { connect } from 'react-redux'

class JobCard extends Component {

    handleClick = e => {
        this.props.setCurJob(this.props.job)
        this.props.history.push(`/jobs/${this.props.job.id}`)
    }

    render() {
        return(
            // <Link to={`/jobs/${this.props.job.id}`}>
            <Card onClick={this.handleClick}>
                <Card.Content>
                    <Card.Header>{this.props.job.name}</Card.Header>
                    <Card.Description>
                        <p><strong>Address: </strong>{this.props.job.street_address}</p>
                        <p><strong>City: </strong>{this.props.job.city}</p>
                        <p><strong>State: </strong>{this.props.job.state}</p>
                    </Card.Description>
                </Card.Content>
            </Card>
            // </Link>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setCurJob: job => dispatch({type: "SET_JOB", job: job})
    }
}

export default withRouter(connect(null, mapDispatchToProps)(JobCard))