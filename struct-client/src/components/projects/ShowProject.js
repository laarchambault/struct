import React from 'react'
import { convertUnixToUserDate, convertUnixToUserTime } from '../../calculations/timeConversions'
import { getSubcontractorsForProject } from './projectFunctions'
import { connect } from 'react-redux'
import { Grid, Button, Item, Header } from 'semantic-ui-react'


class ShowProject extends React.Component {
    state={ subcontractors: [] }
    //TODO:create toggle function to change style of button when active
    
    handleStatusChange = e => {
        let projectObj = { ...this.props.currentProject}
        projectObj.status = e.target.innerText
        fetch( `http://localhost:3000/projects/${this.props.currentProject.id}`, {
            method: 'PUT',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectObj)
        })
        .then(r => {
            if(r.ok) {
                return r.json()
            } else {
                throw r
            }
        })
        .then(project => {
            this.props.updateProject(project)
        })
        .catch(error => console.log(error))
    }

    componentDidMount = () => {
        getSubcontractorsForProject(this.props.currentProject.id)
        .then(subcontractors => {
            debugger
            this.setState({subcontractors: subcontractors})
        })
    }


    highestPermission = () => {
        if(this.props.currentJob.permission > this.props.projectPermission) {
            return this.props.currentJob.permission
        } else {
            return this.props.projectPermission
        }
    }

    render() {
        const { showEdit, currentProject, currentJob } = this.props
        return(
            <Grid divided='vertically' > {/*TODO: className={come up with something to style the project like a box>}*/} 
                { this.highestPermission() > 0 && this.highestPermission() < 4 ?
                    <Button onClick={showEdit}>Edit Project Details</Button>
                : null}
                <Grid.Row columns={2}>
                    <Grid.Column floated='left' textAlign='left'>
                        <h3>{currentJob.name}</h3>
                    </Grid.Column>
                    <Grid.Column floated='right' textAlign='right'>
                        <h1>{currentProject.name}</h1>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={4}>
                    <Grid.Column >
                        <h3>Project Status: {currentProject.status}</h3>
                    </Grid.Column>
                    <Grid.Column >
                        <h3>Weather Data Unavailable</h3>
                    </Grid.Column>
                    <Grid.Column> 
                    <h1>{convertUnixToUserDate(currentProject.start_time)}</h1>
                    <h1>{convertUnixToUserTime(currentProject.start_time)}</h1>
                    </Grid.Column>
                    <Grid.Column >
                    <h1>{convertUnixToUserDate(currentProject.end_time)}</h1>
                    <h1>{convertUnixToUserTime(currentProject.end_time)}</h1>                    </Grid.Column>
                </Grid.Row>
                { this.highestPermission() === 1 || this.highestPermission() === 2 ?
                    <Grid.Row centered>
                        <Button onClick={this.handleStatusChange}>Not Started</Button>
                        <Button onClick={this.handleStatusChange}>In Progress</Button>
                        <Button onClick={this.handleStatusChange}>Ready for Next Project</Button>
                        <Button onClick={this.handleStatusChange}>Approved</Button><br/>
                    </Grid.Row>
                : null}
    
                { this.highestPermission() > 0 && this.highestPermission() < 4 ?
                    <Grid.Row columns={1}>
                    <Grid.Column>
                        <Header as='h2'>Subcontractors</Header>
                        { this.state.subcontractors.map(subcontractor => {
                            return (
                            <Item>
                                <Item.Header><strong>{subcontractor.user.f_name} {subcontractor.user.L_name}</strong></Item.Header>
                                <Item.Meta>{subcontractor.user.phone}</Item.Meta>
                                <Item.Meta>{subcontractor.user.email}</Item.Meta>
                                <Item.Header>Company Info</Item.Header>
                                <Item.Meta><strong>{subcontractor.user.company}</strong></Item.Meta>
                                <Item.Meta>{subcontractor.user.company_phone}</Item.Meta>
                                <Item.Meta>{subcontractor.user.company_email}</Item.Meta>
                            </Item>
                            )
                        })}
                        
                    </Grid.Column>
                </Grid.Row>
                : null }
                

                <Grid.Row columns={1}>
                    <Grid.Column>
                        <Item>
                            <Item.Header>Subcontractor Needs</Item.Header>
                            <Item.Description>{currentProject.sub_needs}</Item.Description>
                        </Item>
                    </Grid.Column>
                </Grid.Row>

            </Grid>
        
        
        
        )
    }
}

const mapStateToProps = state => {
    return {
        currentJob: state.currentJob,
        currentProject: state.currentProject
    }
}

export default connect(mapStateToProps)(ShowProject)