import React from 'react'
import structLogo from '../images/struct-logo.png'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button, Image } from 'semantic-ui-react'
import { actions } from '../exports/actions'

const NavBar = props => {

    const currentUser = useSelector( state => state.currentUser)
    const currentJob = useSelector( state => state.currentJob)

    const dispatch = useDispatch()

    const handleLogout= () => {
        fetch('http://localhost:3000/logout', {
            method: 'POST',
            credentials: 'include'
        })
        .then(r => r.json())
        .then( () => {
            dispatch(actions.logout())
            props.history.push('/')
        })
    }

    return(
        <div className='nav top header'>
            { currentUser ? 
                <>
                <Image id='nav-logo' src={structLogo} alt='struct logo' />
                <Button className='left' onClick={() => props.history.push('/contacts')}>Contacts</Button>
                { currentJob ? 
                    <>
                    <Button className='left' onClick={() => props.history.push('/jobs')}>Back to All Jobs</Button>
                    { currentJob.permission === 1 || currentJob.permission === 2 ?
                        <Button className='left' onClick={() => props.history.push(`/jobs/${currentJob.id}/edit`)}>Edit Job Details</Button>
                        : null }
                    </>
                    : null }
                <Button className='right' onClick={() => props.history.push('/editProfile')}>Profile</Button>
                <Button className='right' onClick={() => handleLogout()}>Log Out</Button>
                
                
                </>
                :
                null}
        </div>
        
    )
}

export default withRouter(NavBar)