import React from 'react'
import { fetchProjects, fetchUserProjects, createProjectItem, groups, keys, updateItemList, highestPermission } from './projectFunctions'
import ShowProject from './ShowProject'
import {  withRouter } from 'react-router-dom'
import EditProject from './EditProject'
import Loading from '../../Loading'
// import { convertUnixToUserDate, convertUnixToUserTime } from '../../calculations/timeConversions'
import { connect } from 'react-redux'
import { Button, Header } from 'semantic-ui-react'
import Timeline, { TimelineHeaders, DateHeader } from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import NewProject from './NewProject'
import moment from 'moment'


class ProjectWindow extends React.Component {

    state={ 
        view: '',
        newStartTime: ''
    }

    setView = view => {
        this.setState({view: view})
    }

    handleClick = e => {
        this.setView('new')
    }

    itemSelectCallback = (itemId, e) => {
        const projId = itemId
        const project = this.props.currentJobProjects.find(project => project.id === projId)
        this.props.setCurrentProject(project)
        this.setView('show')
    }

    handleCanvasClick = (groupId, time, e) => {
        if(highestPermission(this.props) !== 1) {
            return
        }
        this.setState({newStartTime: time})
        this.setView('new')
    }


    fetchUserProjectsAndSetState = (jobId, updView=this.state.view) => {
        fetchUserProjects(jobId)
        .then( projects => {
            this.props.setUserProjects(projects)
            this.setView(updView)
        })
        .catch(console.error)
    }

    //fetches job projects and userProjects, setting redux state
    componentDidMount = () => {
        this.props.toggleLoad()
        this.setState({view: ''})
        fetchProjects(this.props.currentJob.id)
        .then(projects => {
            let items = projects.map( project => {
                return createProjectItem(project)
            })
            this.props.setCurrentJobProjects(projects)
            this.props.setItems(items)
            this.props.toggleLoad()
        })
        .catch( error => {
            console.error(error)
            this.props.toggleLoad()
        })
        this.fetchUserProjectsAndSetState(this.props.currentJob.id)
    }

    updateFromEdit = project => {
        this.setView('show')
        this.updateItems(project)
        this.updateProject(project)
    }

    updateItems = project => {
        let updItem = createProjectItem(project)
        let itemArr = updateItemList(this.props.items, updItem, project.id)
        this.props.setItems(itemArr)
    }
    

    updateProject = newProject => {
        let updProjects = [...this.props.currentJobProjects]
        let i = updProjects.findIndex( project => project.id === newProject.id)
        updProjects[i] = newProject
        this.props.setCurrentJobProjects(updProjects)
        this.props.setCurrentProject(newProject) 
    }

    updateStateFromNew = project => {
        let newItem = createProjectItem(project)
        let itemArr = [...this.props.items, newItem]
        let projArr = [...this.props.currentJobProjects, project]
        this.props.setItems(itemArr)
        this.props.setCurrentJobProjects(projArr)
        this.props.setCurrentProject(project)
    }



    handleItemMove = (itemId, dragTime, newGroupOrder) => {
        if(highestPermission(this.props) !== 1 && highestPermission(this.props) !== 2) {
            return
        }
        //fetch request to update start and end times by number of milliseconds different in dragTime
        fetch(`http://localhost:3000/projects/${itemId}/move`, {
            method: 'PATCH',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({newStart: dragTime})
        })
        .then(r => {
            if(r.ok) {
                return r.json()
            } else {
                throw r
            }
        })
        .then( project => {
            this.updateFromEdit(project)
        })
    }

    handleItemResize = (itemId, time, edge) => {
        if(highestPermission(this.props) !== 1 && highestPermission(this.props) !== 2) {
            return
        }
        fetch(`http://localhost:3000/projects/${itemId}/resize`, {
            method: 'PATCH',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({time: time, edge: edge})
        })
        .then(r => {
            if(r.ok) {
                return r.json()
            } else {
                throw r
            }
        })
        .then( project => {
            this.updateFromEdit(project)
        })
    }



    render() {
        return(
        <>
            {this.props.loading ? <Loading/> :
                <div>
                { this.props.currentJob.permission === 1 || this.props.currentJob.permission === 2 ?
                <div className='nav heading second'>
                    <Button className='left' onClick={this.handleClick}>New Project</Button>
                </div>
                : null }
                <div className='nav heading'>
                    <Header as='h1' floated='left'>{this.props.currentJob.name}</Header>
                    <div className='pad-top'>
                        <Header as='h3' floated='left'>{this.props.currentJob.street_address}</Header>
                        <Header as='h3' floated='left'>{this.props.currentJob.city}</Header>
                        <Header as='h3' floated='left'>{this.props.currentJob.state}</Header>
                    </div>
                </div>
                <div className='timeline'>
                    <Timeline groups={groups} //'groups' and 'keys' are defined in helper functions
                        items={this.props.items}
                        keys={keys}
                        defaultTimeStart={moment().add(-12, 'hour')}
                        defaultTimeEnd={moment().add(12, 'hour')}
                        sidebarWidth={0}
                        lineHeight={50}
                        onItemSelect={this.itemSelectCallback}
                        onCanvasClick={this.handleCanvasClick}
                        onItemMove={this.handleItemMove}
                        onItemResize={this.handleItemResize}
                        >
                        <TimelineHeaders>
                            <DateHeader
                                className='calendar-header'
                                unit="primaryHeader"
                                />
                            <DateHeader />
                        </TimelineHeaders>
                    </Timeline>
                </div>
                
                { this.state.view === 'new' ?
                    <NewProject 
                        updateState={this.updateStateFromNew}
                        updateUsers={this.fetchUserProjectsAndSetState}
                        setView={this.setView}
                        startTime={this.state.newStartTime}
                        /> 
                : this.state.view === 'edit' ?
                        <EditProject 
                            updateState={this.updateFromEdit}
                            updateUsers={this.fetchUserProjectsAndSetState}
                            setView={this.setView}
                            />
                        :
                        this.state.view === 'show' ?
                            <ShowProject 
                                showEdit={() => this.setView('edit')} 
                                updateProject={this.updateProject} 
                                />
                        : null }
            </div>
            }
        </>
    )}
}

const mapStateToProps = state => {
    return {
        loading: state.loading,
        currentJob: state.currentJob,
        currentJobProjects: state.currentJobProjects,
        userProjects: state.userProjects,
        items: state.items,
        currentProject: state.currentProject
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setCurrentJob: job => dispatch({type: 'SET_JOB', job}),
        setCurrentProject: project => dispatch({type: 'SET_PROJECT', project}),
        setUserProjects: projects => dispatch({type: 'SET_USER_PROJECTS', projects}),
        toggleLoad: () => dispatch({type: 'TOGGLE_LOADING'}),
        setCurrentJobProjects: projects => dispatch({type: 'SET_CURRENT_JOB_PROJECTS', projects}),
        setItems: items => dispatch({type: 'SET_ITEMS', items}),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectWindow))