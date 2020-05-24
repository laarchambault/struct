import React from 'react'
import { fetchProjects, fetchUserProjects, createProjectItem, groups, keys, updateItemList } from './projectFunctions'
import ShowProject from './ShowProject'
import {  withRouter } from 'react-router-dom'
import EditProject from './EditProject'
import Loading from '../../Loading'
// import { convertUnixToUser } from '../../calculations/timeConversions'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import Timeline from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import NewProject from './NewProject'
import moment from 'moment'




class ProjectWindow extends React.Component {

    state={ projects: [], items: [], view: '', project: '', userProjects: []}

    handleDoubleClick = e => {
        const projId = parseInt(e.currentTarget.title, 10)
        this.setState({view: 'show', project: projId})
    }
    
    setView =(view) => {
        this.setState({view: view})
    }


    handleClick = e => {
        this.setView('new')
    }

    fetchUserProjectsAndSetState = (jobId, view=this.state.view) => {
        fetchUserProjects(jobId)
        .then( projects => {
            this.setState({userProjects: projects}) 
            this.setView(view)
        })
        .catch(console.error)
    }

    componentDidMount = () => {
        console.log('did run')
        this.props.toggleLoad()
        fetchProjects(this.props.jobId)
        .then(projects => {
            let items = projects.map( project => {
                return createProjectItem(project, this.handleDoubleClick)
            })
            this.setState({ projects: projects, items: items})
            this.props.toggleLoad()
        })
        .catch(console.error)

        this.fetchUserProjectsAndSetState(this.props.jobId)
        
    }


    updateStateFromNew = (project) => {
        let newItem = createProjectItem(project, this.handleDoubleClick)
        let itemArr = [...this.state.items, newItem]
        let projArr = [...this.state.projects, project]
        this.setState({
            ...this.state,
            items: itemArr,
            projects: projArr,
            project: project.id
        })
    }

    setViewFromEdit = project => {
        this.setView('show')
        let updItem = createProjectItem(project, this.handleDoubleClick)
        let itemArr = updateItemList(this.state.items, updItem, project.id)
        this.setState({items: itemArr})
        this.updateProject(project)
        
    }

    updateProject = newProject => {
        let i = this.state.projects.findIndex( project => project.id === newProject.id)
        let updProjects = [...this.state.projects]
        updProjects[i] = newProject
        this.setState({
            projects: updProjects
        })
        
        
    }

    currentProject = () => {
        return this.state.projects.find(project => 
            project.id === this.state.project
        )
    }

    currentPermission = () => {
        const project = this.state.userProjects.find( userProject => 
            userProject.project_id === this.currentProject().id
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
                    items={this.state.items}
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
                                project={this.currentProject()} 
                                permission={this.currentPermission()} 
                                setView={this.setViewFromEdit}
                                updateUsers={this.fetchUserProjectsAndSetState}
                                />
                            :
                            this.state.view === 'show' ?
                                <ShowProject 
                                    showEdit={() => this.setView('edit')} 
                                    project={this.currentProject()} 
                                    projectPermission={this.currentPermission()} 
                                    jobPermission={this.props.currentJob.permission} 
                                    updateProject={this.updateProject} 
                                    />
                            : null }
                </div>
                }
            </>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        jobId: state.currentJob.id,
        loading: state.loading,
        currentJob: state.currentJob
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleLoad: () => dispatch({type: 'TOGGLE_LOADING'})
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectWindow))