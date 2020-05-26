import React from 'react'
import { fetchProjects, fetchUserProjects, createProjectItem, groups, keys, updateItemList } from './projectFunctions'
import TestShowProject from './TestShowProject'
import {  withRouter } from 'react-router-dom'
import EditProject from './EditProject'
import Loading from '../../Loading'
// import { convertUnixToUserDate, convertUnixToUserTime } from '../../calculations/timeConversions'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import Timeline from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import NewProject from './NewProject'
import moment from 'moment'


class ProjectWindow extends React.Component {

    state={ view: '' }

    setView = view => {
        this.setState({view: view})
    }

    handleClick = e => {
        this.setView('new')
    }

    handleDoubleClick = e => {
        const projId = parseInt(e.currentTarget.title, 10)
        const project = this.props.currentJobProjects.find(project => project.id === projId)
        this.props.setCurrentProject(project)
        this.setView('show')
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
                return createProjectItem(project, this.handleDoubleClick)
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
        let updItem = createProjectItem(project, this.handleDoubleClick)
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
        let newItem = createProjectItem(project, this.handleDoubleClick)
        let itemArr = [...this.props.items, newItem]
        let projArr = [...this.props.currentJobProjects, project]
        this.props.setItems(itemArr)
        this.props.setCurrentJobProjects(projArr)
        this.props.setCurrentProject(project)
    }

    currentPermission = () => {
        const project = this.props.userProjects.find( userProject => 
            userProject.project_id === this.props.currentProject.id
            )
        if(project){
            return project.permission
        } else {
            return null
        } 
    }

    render() {
        return(
        <>
            {this.props.loading ? <Loading/> :
                <div>
                { this.props.currentJob.permission === 1 || this.props.currentJob.permission === 2 ?
                <Button onClick={this.handleClick}>New Project</Button>
                : null }
                <Timeline groups={groups} //'groups' and 'keys' are defined in helper functions
                items={this.props.items}
                keys={keys}
                defaultTimeStart={moment().add(-12, 'hour')}
                defaultTimeEnd={moment().add(12, 'hour')}/>
                { this.state.view === 'new' ?
                    <NewProject 
                        updateState={this.updateStateFromNew}
                        updateUsers={this.fetchUserProjectsAndSetState}
                        setView={this.setView}
                        /> 
                : this.state.view === 'edit' ?
                        <EditProject 
                            updateState={this.updateFromEdit}
                            updateUsers={this.fetchUserProjectsAndSetState}
                            setView={this.setView}
                            />
                        :
                        this.state.view === 'show' ?
                            <TestShowProject 
                                showEdit={() => this.setView('edit')} 
                                projectPermission={this.currentPermission()} 
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