import React, { useState, useEffect } from 'react'
import { convertUnixToUserDate, convertUnixToUserTime } from '../../calculations/timeConversions'
import { getSubcontractorsForProject, getBuildersForProject } from './projectFunctions'
import { useSelector } from 'react-redux'
import { Grid, Button, Item, Header, Card } from 'semantic-ui-react'


const ShowProject = props => {
    const [subcontractors, setSubcontractors] = useState([])
    const [builders, setBuilders] = useState([])
    
    const currentJob = useSelector(state => state.currentJob)
    const currentProject = useSelector( state => state.currentProject )


    const handleStatusChange = e => {
        let projectObj = { ...currentProject}
        projectObj.status = e.target.innerText
        fetch( `http://localhost:3000/projects/${currentProject.id}`, {
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
            props.updateProject(project)
        })
        .catch(error => console.log(error))
    }

    useEffect(() => {
        getSubcontractorsForProject(currentProject.id)
        .then(subcontractors => setSubcontractors(subcontractors))
        getBuildersForProject(currentProject.id)
        .then(builders => setBuilders(builders))
    }, [currentProject])



    const highestPermission = () => {

        if(Number.isInteger(currentJob.permission) && Number.isInteger(currentProject.permission)) {
            return (currentJob.permission > currentProject.permission ?  currentJob.permission :  currentProject.permission)
        } else if(Number.isInteger(currentJob.permission) && !Number.isInteger(currentProject.permission)) {
            return currentJob.permission
        } else if(!Number.isInteger(currentJob.permission) && Number.isInteger(currentProject.permission)) {
            return currentProject.permission
        } else if(!Number.isInteger(currentJob.permission) && !Number.isInteger(currentProject.permission)) {
            return null
        }

    }

    const { showEdit } = props
        return(
            <Grid divided='vertically' id='show-project'> {/*TODO: className={come up with something to style the project like a box>}*/} 
                
                <Grid.Row columns={3}>
                    <Grid.Column>
                    { highestPermission() > 0 && highestPermission() < 4 ?
                        <Button onClick={showEdit}>Edit Project Details</Button>
                    : null}
                    </Grid.Column>
                    <Grid.Column floated='left' textAlign='left'>
                        <h3>{currentJob.name}</h3>
                    </Grid.Column>
                    <Grid.Column>
                    <Header as='h3'>Builder Info</Header>
                        { builders.map(builder => {
                            return (
                                <>
                            <Item className='builder-item'>
                                <Item.Header><strong>{builder.user.f_name} {builder.user.l_name}</strong></Item.Header>
                                <Item.Meta>{builder.user.phone}</Item.Meta>
                                <Item.Meta>{builder.user.email}</Item.Meta>
                                <Item.Header>Company Info</Item.Header>
                                <Item.Meta><strong>{builder.user.company}</strong></Item.Meta>
                                <Item.Meta>{builder.user.company_phone}</Item.Meta>
                                <Item.Meta>{builder.user.company_email}</Item.Meta>
                            </Item><br/>
                            </>
                            )
                        })}
                    </Grid.Column>
                    
                </Grid.Row>
                <Grid.Row columns={1}>
                    <Grid.Column floated='left' textAlign='left'>
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
                { highestPermission() === 1 || highestPermission() === 2 ?
                    <Grid.Row centered>
                        <Button onClick={handleStatusChange}>Not Started</Button>
                        <Button onClick={handleStatusChange}>In Progress</Button>
                        <Button onClick={handleStatusChange}>Ready for Next Project</Button>
                        <Button onClick={handleStatusChange}>Approved</Button><br/>
                    </Grid.Row>
                : null}
    
                { highestPermission() > 0 && highestPermission() < 4 ?
                    <>
                    <Grid.Row columns={1}>
                        <Header as='h2'>Subcontractors</Header>
                    </Grid.Row>
                    <Grid.Row columns={1}>
                        <Card.Group>
                        { subcontractors.map(subcontractor => {
                            return (
                            <Card>
                                <Card.Header><strong>{subcontractor.user.f_name} {subcontractor.user.l_name}</strong></Card.Header>
                                <Card.Meta>{subcontractor.user.phone}</Card.Meta>
                                <Card.Meta>{subcontractor.user.email}</Card.Meta>
                                <Card.Header>Company Info</Card.Header>
                                <Card.Meta><strong>{subcontractor.user.company}</strong></Card.Meta>
                                <Card.Meta>{subcontractor.user.company_phone}</Card.Meta>
                                <Card.Meta>{subcontractor.user.company_email}</Card.Meta>
                            </Card>
                            )
                        })}
                        
                    </Card.Group>
                </Grid.Row>
                </>
                : null }
                

                <Grid.Row columns={1}>
                    <Grid.Column>
                            <Header as='h2' textAlign='left'>Subcontractor Needs</Header>
                            <Header as='h3' textAlign='left'>{currentProject.sub_needs}</Header>
                    </Grid.Column>
                </Grid.Row>

            </Grid>
        
        
        
        )
    
}


export default ShowProject