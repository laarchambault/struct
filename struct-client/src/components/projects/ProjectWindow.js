import React, { useState, useEffect } from 'react'
import { fetchProjects, fetchUserProjects, createProjectItem, groups, keys, updateItemList } from './projectFunctions'
import ShowProject from './ShowProject'
import {  withRouter } from 'react-router-dom'
import EditProject from './EditProject'
import Loading from '../../Loading'
// import { convertUnixToUser } from '../../calculations/timeConversions'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'semantic-ui-react'
import Timeline from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import NewProject from './NewProject'
import moment from 'moment'
import { actions } from '../../exports/actions'


const ProjectWindow = () => {

    const [view, setView] = useState('')

    const loading = useSelector( state => state.loading)
    const currentJob = useSelector( state => state.currentJob)
    const currentJobProjects = useSelector( state => state.currentJobProjects)
    const userProjects = useSelector( state => state.userProjects)
    const items = useSelector( state => state.items)
    const currentProject = useSelector( state => state.currentProject)

    const dispatch = useDispatch()



    const handleClick = e => {
        setView('new')
    }

    const handleDoubleClick = e => {

        const projId = parseInt(e.currentTarget.title, 10)
        debugger
        const project = currentJobProjects.find(project => project.id === projId)
        debugger
        dispatch(actions.setCurrentProject(project))
        debugger
        setView('show')
    }

    const fetchUserProjectsAndSetState = (jobId, updView=view) => {
        fetchUserProjects(jobId)
        .then( projects => {
            dispatch(actions.setUserProjects(projects)) 
            setView(updView)
        })
        .catch(console.error)
    }

    //fetches job projects and userProjects, setting redux state
    useEffect(() => {
        dispatch(actions.toggleLoad())
        fetchProjects(currentJob.id)
        .then(projects => {
            let items = projects.map( project => {
                return createProjectItem(project, handleDoubleClick)
            })
            dispatch(actions.setCurrentJobProjects(projects))
            dispatch(actions.setItems(items))
            dispatch(actions.toggleLoad())
        })
        .catch( error => {
            console.error(error)
            dispatch(actions.toggleLoad())
        })
        fetchUserProjectsAndSetState(currentJob.id)
    }, [dispatch, currentJob.id])


    const updateFromEdit = project => {
        setView('show')
        updateItems(project)
        updateProject(project)
    }

    const updateItems = project => {
        let updItem = createProjectItem(project, handleDoubleClick)
        let itemArr = updateItemList(items, updItem, project.id)
        dispatch(actions.setItems(itemArr))
    }
    

    const updateProject = (newProject ) => {
        let updProjects = [...currentJobProjects]
        let i = updProjects.findIndex( project => project.id === newProject.id)
        updProjects[i] = newProject
        dispatch(actions.setCurrentJobProjects(updProjects))        
    }

    const updateStateFromNew = (project) => {
        let newItem = createProjectItem(project, handleDoubleClick)
        let itemArr = [...items, newItem]
        let projArr = [...currentJobProjects, project]
        dispatch(actions.setItems(itemArr))
        dispatch(actions.setCurrentJobProjects(projArr))
        dispatch(actions.setCurrentProject(project))
    }

    const currentPermission = () => {
        const project = userProjects.find( userProject => 
            userProject.project_id === currentProject.id
            )
        if(project){
            return project.permission
        } else {
            return null
        } 
    }


    return(
        <>
            {loading ? <Loading/> :
                <div>
                { currentJob.permission === 1 || currentJob.permission === 2 ?
                <Button onClick={handleClick}>New Project</Button>
                : null }
                <Timeline groups={groups} //'groups' and 'keys' are defined in helper functions
                items={items}
                keys={keys}
                defaultTimeStart={moment().add(-12, 'hour')}
                defaultTimeEnd={moment().add(12, 'hour')}/>
                { view === 'new' ?
                    <NewProject 
                        updateState={updateStateFromNew}
                        updateUsers={fetchUserProjectsAndSetState}
                        setView={setView}
                        /> 
                : view === 'edit' ?
                        <EditProject 
                            project={currentProject} 
                            permission={currentPermission()} 
                            updateState={updateFromEdit}
                            updateUsers={fetchUserProjectsAndSetState}
                            />
                        :
                        view === 'show' ?
                            <ShowProject 
                                showEdit={() => setView('edit')} 
                                project={currentProject} 
                                projectPermission={currentPermission()} 
                                jobPermission={currentJob.permission} 
                                updateProject={updateProject} 
                                />
                        : null }
            </div>
            }
        </>
        
    )
}

export default withRouter(ProjectWindow)