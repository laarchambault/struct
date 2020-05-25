import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import { actions } from '../exports/actions'

const NavBar = () => {

    const currentUser = useSelector( state => state.currentUser)
    const currentJob = useSelector( state => state.currentJob)
    const currentProject = useSelector( state => state.currentProject)

    const dispatch = useDispatch()

    const handleLogout= () => {
        fetch('http://localhost:3000/logout', {
            method: 'POST',
            credentials: 'include'
        })
        .then(r => r.json())
        .then( () => {
            dispatch(actions.logout())
            this.props.history.push('/')
        })
    }

    return(
        <div>
            { currentUser ? 
                <>
                <Button onClick={() => this.props.history.push('/editProfile')}>Profile</Button>
                <Button onClick={() => handleLogout()}>Log Out</Button>
                <Button onClick={() => this.props.history.push('/contacts')}>Contacts</Button>
                { currentJob ? 
                    <>
                    <Button onClick={() => this.props.history.push('/jobs')}>Back to All Jobs</Button>
                    { currentProject && (currentJob.permission === 1 || currentJob.permission === 2) ?
                        <Button onClick={`/jobs/${currentProject.id}/edit`}>Edit Job Details</Button>
                        : null }
                    </>
                    : null }
                
                </>
                :
                null}
        </div>
        
    )
}

export default withRouter(NavBar)