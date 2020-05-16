import React from 'react'
import { fetchProjects, createProjectItem } from './projectFunctions'
import ShowProject from './ShowProject'
// import { convertUnixToUser } from '../../calculations/timeConversions'
import { connect } from 'react-redux'
import Timeline from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import NewProject from './NewProject'
import moment from 'moment'




class ProjectWindow extends React.Component {

    state={ projects: [], items: [], view: ''}

    handleDoubleClick = e => {

        const projId = parseInt(e.currentTarget.title, 10)
        this.setState({view: projId})
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

    componentDidMount = () => {
        fetchProjects(this.props.jobId)
        .then(projects => {
            let items = projects.map( project => {
                return createProjectItem(project, this.handleDoubleClick)
            })
            this.setState({ projects: projects, items: items})
        })
        .catch(error => console.log(error))
    }

    updateProject = newProject => {
        let i = this.state.projects.findIndex( project => project.id === newProject.id)
        let updProjects = [...this.state.projects]
        updProjects[i] = newProject
        this.setState({ projects: updProjects})
    }

    currentProject = () => {
        return this.state.projects.find(project => 
            project.id === this.state.view
        )
    }

    render() {
        return(
            <div>
                <Timeline groups={this.groups}
                items={this.state.items}
                keys={this.keys}
                defaultTimeStart={moment().add(-12, 'hour')}
                defaultTimeEnd={moment().add(12, 'hour')}/>
                { this.state.view === 'new' ? 
                    <NewProject /> 
                : Number.isInteger(this.state.view) ?
                        <ShowProject project={this.currentProject()} updateProject={this.updateProject}/>
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