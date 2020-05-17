import React from 'react'
import { convertUnixToUser } from '../../calculations/timeConversions'
import { connect } from 'react-redux'
import { Grid, Button, Item } from 'semantic-ui-react'


class ShowProject extends React.Component {

    //create toggle function to change style of button when active
    
    handleStatusChange = e => {
        let projectObj = { ...this.props.project}
        projectObj.status = e.target.innerText
        fetch( `http://localhost:3000/projects/${this.props.project.id}`, {
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

    render() {
        return(
            <Grid divided='vertically' > {/*className={come up with something to style the project like a box>}*/} 
                <Button onClick={this.props.showEdit}>Edit Project Details</Button>
                <Grid.Row columns={2}>
                    <Grid.Column floated='left' textAlign='left'>
                        <h3>{this.props.currentJob.name}</h3>
                    </Grid.Column>
                    <Grid.Column floated='right' textAlign='right'>
                        <h1>{this.props.project.name}</h1>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={4}>
                    <Grid.Column >
                        <h3>Project Status: {this.props.project.status}</h3>
                    </Grid.Column>
                    <Grid.Column >
                        <h3>Weather Data Unavailable</h3>
                    </Grid.Column>
                    <Grid.Column> </Grid.Column>
                    <Grid.Column >
                        <h1>{convertUnixToUser(this.props.project.start_time) + '  -  ' + convertUnixToUser(this.props.project.end_time)}</h1>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row centered>
                    <Button onClick={this.handleStatusChange}>Not Started</Button>
                    <Button onClick={this.handleStatusChange}>In Progress</Button>
                    <Button onClick={this.handleStatusChange}>Ready for Next Project</Button>
                    <Button onClick={this.handleStatusChange}>Approved</Button><br/>
                </Grid.Row>
                
                <Grid.Row columns={1}>
                    <Grid.Column>
                        <Item>
                            <Item.Meta>Will contain subcontractor contact info</Item.Meta>
                        </Item>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={1}>
                    <Grid.Column>
                        <Item>
                            <Item.Header>Subcontractor Needs</Item.Header>
                            <Item.Description>{this.props.project.sub_needs}</Item.Description>
                        </Item>
                    </Grid.Column>
                </Grid.Row>

            </Grid>
        
        
        
        
        
        )
    }
}

const mapStateToProps = state => {
    return {
        currentJob: state.currentJob
    }
}

export default connect(mapStateToProps)(ShowProject)