import React from 'react'
import { fetchProjects, fetchUserProjects, createProjectItem } from './projectFunctions'
import ShowProject from './ShowProject'
import EditProject from './EditProject'
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

    groups = [{ id: 1, title: '',
        stackItems: true }]

    keys = {
        groupIdKey: 'id',
        groupTitleKey: 'title',
        groupRightTitleKey: 'rightTitle',
        itemIdKey: 'id',
        itemTitleKey: 'title',
        itemDivTitleKey: 'id',
        itemGroupKey: 'group',
        itemTimeStartKey: 'start_time',
        itemTimeEndKey: 'end_time',
    }

    handleClick = e => {
        this.setState({view: 'new'})
    }

    componentDidMount = () => {
        fetchProjects(this.props.jobId)
        .then(projects => {
            let items = projects.map( project => {
                return createProjectItem(project, this.handleDoubleClick)
            })
            this.setState({ projects: projects, items: items})
        })
        .catch(console.error)

        fetchUserProjects(this.props.jobId)
        .then( projects => {
            // debugger
            this.setState({userProjects: projects}) 
        })
        .catch(console.error)
    }


    setViewFromNew = (project) => {
        let newItem = createProjectItem(project, this.handleDoubleClick)
        let itemArr = [...this.state.items, newItem]
        let projArr = [...this.state.projects, project]
        this.setState({
            ...this.state,
            view: 'show',
            items: itemArr,
            projects: projArr,
            project: project.id
        })
    }

    setViewFromEdit = project => {
        let updItem = createProjectItem(project, this.handleDoubleClick)
        //move to projectFunctions and import below
        let i = this.state.items.findIndex(item => item.id === project.id)
        let itemArr = [...this.state.items.slice(0, i), updItem, this.state.items.slice(i + 1)]
        this.setState({view: 'show', items: itemArr})
        this.updateProject(project)
    }

    updateProject = newProject => {
        let i = this.state.projects.findIndex( project => project.id === newProject.id)
        let updProjects = [...this.state.projects]
        updProjects[i] = newProject
        this.setState({ projects: updProjects})
    }
    //TODO: create universal 'set view' function that
    //takes value as an argument (setView('edit'))
    showEdit = () => {
        this.setState({view: 'edit'})
    }

    currentProject = () => {
        return this.state.projects.find(project => 
            project.id === this.state.project
        )
    }

    render() {
        return(
            <div>
                <Button onClick={this.handleClick}>New Project</Button>
                <Timeline groups={this.groups}
                items={this.state.items}
                keys={this.keys}
                defaultTimeStart={moment().add(-12, 'hour')}
                defaultTimeEnd={moment().add(12, 'hour')}/>
                { this.state.view === 'new' ? 
                    <NewProject setView={this.setViewFromNew}/> 
                : this.state.view === 'edit' ?
                        <EditProject project={this.currentProject()} permission={this.state.userProjects[this.currentProject().id]} setView={this.setViewFromEdit}/>
                        :
                        this.state.view === 'show' ?
                            <ShowProject showEdit={this.showEdit} project={this.currentProject()} permission={this.state.userProjects[this.currentProject().id]}updateProject={this.updateProject}/>
                        : null }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        jobId: state.currentJob.id
    }
}

export default connect(mapStateToProps)(ProjectWindow)