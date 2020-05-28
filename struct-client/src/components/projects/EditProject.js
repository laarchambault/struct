import React from 'react'
import { convertUserToUnix } from '../../calculations/timeConversions.js'
import { connect } from 'react-redux'
import { Form, Button } from 'semantic-ui-react'
import { statusOptions, returnEditStateFromProject, fetchAssignContactsToProject, fetchUpdateProject } from './projectFunctions'
import ProjectContactAssignForm from '../contacts/ProjectContactAssignForm.js'
import Loading from '../../Loading.js'


class EditProject extends React.Component {

    state={
        name: '',
        s_year: '',
        s_month: '',
        s_day: '',
        s_hour: '',
        s_minute: '',
        e_year: '',
        e_month: '',
        e_day: '',
        e_hour: '',
        e_minute: '',
        sub_needs: '',
        status: '',
        checkedContacts: [],
    }

    

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleDropdown = e => {
        this.setState({ status: e.target.innerText})
    }

    getContactsForThisProject = projId => {
        fetch(`http://localhost:3000/projects/${projId}/contacts`, {
            credentials: 'include'
        })
        .then(r => {
            if(r.ok) {
                return r.json()
            } else {
                throw r
            }
        })
        .then(projectPermissions => {
            this.setState({checkedContacts: projectPermissions})
        })
    }

    contactsWithLowerOrEqualPermissionThanCurrentUser = () => {
        const userPermission = this.highestPermission()
        debugger
        const higherChecked = [...this.state.checkedContacts].filter( record => {
            return (record.permission < userPermission) || (record.permission === null)
        })
        debugger
        const idsOnlyHigherChecked = higherChecked.map(contactObj => contactObj.user_id)
        debugger
        return this.props.contacts.filter(contact => 
            !idsOnlyHigherChecked.includes(contact.id)  
        )
        //you have a list of contacts without 
    }


    handleSubmit = e => {
        e.preventDefault()
        const startUnix = convertUserToUnix('start', this.state)
        const endUnix = convertUserToUnix('end', this.state)
        const bodyObj = {
            name: this.state.name,
            start_time: startUnix,
            end_time: endUnix,
            sub_needs: this.state.sub_needs,
            status: this.state.status,
            job_id: this.props.currentJob.id
        }
        fetchUpdateProject(this.props.currentProject.id, bodyObj)
        .then(project => {
            const contactObj = {
                checkedContacts: this.state.checkedContacts, 
                job_id: this.props.currentJob.id
            }
            fetchAssignContactsToProject(contactObj, project.id)
            .then(() => {
                //we are not using return value here; rather, the following steps
                //need to wait until the fetch is resolved
                this.props.updateState(project)
                this.props.updateUsers(this.props.currentJob.id, 'show')
            })
        })
        .catch(error => console.log(error))
    }

    componentDidMount() {
        this.props.toggleLoad()
        this.setState(returnEditStateFromProject(this.props.currentProject))
        this.getContactsForThisProject(this.props.currentProject.id)//used to prepopulate edit form with user permissions
        this.props.toggleLoad()
    }

    handleContactChange = (e, { value }) => { //TODO: refactor by adding this wherever the other handleContactChange functions go
        const arr = value.split(' ')
        const permiss = arr[0]
        const u_id = arr[1]
        const updCheckedContacts = [...this.state.checkedContacts]
        const i = updCheckedContacts.findIndex(obj => {
            return obj.user_id === parseInt(u_id, 10)
        })
        const newContact = {user_id: parseInt(u_id, 10), permission: parseInt(permiss, 10)}
            if( i < 0 ) {
                updCheckedContacts.push(newContact)
            } else {
                updCheckedContacts[i] = newContact
            }
            this.setState({
                ...this.state,
                checkedContacts: updCheckedContacts
            })
    }

    dropdownValue = (contact_id) => {
        if (this.state.checkedContacts.length > 0) {
            const contactObj = this.state.checkedContacts.find( c => c.user_id === contact_id)
            if (contactObj) {
                return contactObj.permission + ' ' + contactObj.user_id
            } else {
                return `4 ${contact_id}`
            }
        } else {
            return `4 ${contact_id}`
        }
    }

    highestPermission = () => {
        if(Number.isInteger(this.props.currentJob.permission) && Number.isInteger(this.props.currentProject.permission)) {
            return (this.props.currentJob.permission > this.props.currentProject.permission ?  this.props.currentJob.permission :  this.props.currentProject.permission)
        } else if(Number.isInteger(this.props.currentJob.permission) && !Number.isInteger(this.props.currentProject.permission)) {
            return this.props.currentJob.permission
        } else if(!Number.isInteger(this.props.currentJob.permission) && Number.isInteger(this.props.currentProject.permission)) {
            return this.props.currentProject.permission
        } else if(!Number.isInteger(this.props.currentJob.permission) && !Number.isInteger(this.props.currentProject.permission)) {
            return null
        }
    }

    render() {
        return(
            <>
            {this.props.loading ? <Loading/> :
                <div>
                <Button className='left' onClick={() => this.props.setView('show')}>Back to Project</Button>
                <h1 className='page-header'>Edit Project</h1>
                <Form onSubmit={this.handleSubmit} autocomplete="off">
                    
                    <Form.Input 
                    label='Title ' 
                    value={this.state.name} 
                    name="name" 
                    onChange={this.handleChange} 
                    disabled={ this.highestPermission() === 1 || this.highestPermission() === 2 ? false : true}
                    />
                    
                    
                    <h2 className='page-header' style={{fontSize: '2em', padding: '1.5em'}}>Project Start Time</h2>
                    <Form.Group>
                        <Form.Input width='2'
                            label='Month (MO) ' 
                            type='integer' 
                            value={this.state.s_month} 
                            name="s_month" 
                            onChange={this.handleChange} 
                            disabled={ this.highestPermission() === 1 || this.highestPermission() === 2 ? false : true}
                            />
                        <Form.Input width='2'
                            label='Day (DD) ' 
                            type='integer' 
                            value={this.state.s_day} 
                            name="s_day" 
                            onChange={this.handleChange} 
                            disabled={ this.highestPermission() === 1 || this.highestPermission() === 2 ? false : true}
                            />
                        <Form.Input width='2'
                            label='Hour (HH) ' 
                            type='integer' 
                            value={this.state.s_hour} 
                            name="s_hour" 
                            onChange={this.handleChange} 
                            disabled={ this.highestPermission() === 1 || this.highestPermission() === 2 ? false : true}
                            />
                        <Form.Input width='2'
                            label='Minute (MM) ' 
                            type='integer' 
                            value={this.state.s_minute} 
                            name="s_minute" 
                            onChange={this.handleChange} 
                            disabled={ this.highestPermission() === 1 || this.highestPermission() === 2 ? false : true}
                            />
                        <Form.Input width='3'
                            label='Year (YYYY) ' 
                            type='integer' 
                            value={this.state.s_year} 
                            name="s_year" 
                            onChange={this.handleChange} 
                            disabled={ this.highestPermission() === 1 || this.highestPermission() === 2 ? false : true}
                            />
                    </Form.Group>
                    
                    
                    <h2 className='page-header' style={{fontSize: '2em', padding: '1.5em'}}>Project End Time</h2>
                    <Form.Group>
                        <Form.Input width='2'
                            label='Month (MO) ' 
                            type='integer' 
                            value={this.state.e_month} 
                            name="e_month" 
                            onChange={this.handleChange} 
                            disabled={ this.highestPermission() === 1 || this.highestPermission() === 2 ? false : true}
                            /><br/>
                        <Form.Input width='2'
                            label='Day (DD) ' 
                            type='integer' 
                            value={this.state.e_day} 
                            name="e_day" 
                            onChange={this.handleChange} 
                            disabled={ this.highestPermission() === 1 || this.highestPermission() === 2 ? false : true}
                            /><br/>
                        <Form.Input width='2'
                            label='Hour (HH) ' 
                            type='integer' 
                            value={this.state.e_hour} 
                            name="e_hour" 
                            onChange={this.handleChange} 
                            disabled={ this.highestPermission() === 1 || this.highestPermission() === 2 ? false : true}
                            /><br/>
                        <Form.Input width='2'
                            label='Minute (MM) ' 
                            type='integer' 
                            value={this.state.e_minute} 
                            name="e_minute" 
                            onChange={this.handleChange} 
                            disabled={ this.highestPermission() === 1 || this.highestPermission() === 2 ? false : true}
                            /><br/>
                        <Form.Input width='3'
                            label='Year (YYYY) ' 
                            type='integer' 
                            value={this.state.e_year} 
                            name="e_year" 
                            onChange={this.handleChange} 
                            disabled={ this.highestPermission() === 1 || this.highestPermission() === 2 ? false : true}
                            /><br/>
                    </Form.Group>

                    <h2 className='page-header' style={{fontSize: '2em', padding: '1.5em'}}> Subcontractor Requirements (optional) </h2>
                    <Form.Input value={this.state.sub_needs} name='sub_needs' onChange={this.handleChange} /><br/>

                    <h2 className='page-header' style={{fontSize: '2em', padding: '1.5em'}}>Project Status</h2>
                    <Form.Dropdown 
                        placeholder='Select Status'
                        fluid
                        selection='true'
                        options={statusOptions}
                        onChange={this.handleDropdown}
                        disabled={ this.highestPermission() === 1 || this.highestPermission() === 2 ? false : true}
                    />
                    {this.contactsWithLowerOrEqualPermissionThanCurrentUser().length > 0 ?
                        <>
                        <h2 className='page-header' style={{fontSize: '2em', padding: '1.5em'}}>Add Users to This Project </h2>
                        <Form.Group>
                        {this.contactsWithLowerOrEqualPermissionThanCurrentUser().map(contact => 
                            <ProjectContactAssignForm 
                            key={`contact ${contact.id}`}
                            contact={contact}
                            permission={this.highestPermission()}
                            handleChange={this.handleContactChange} 
                            checkedContacts={this.state.checkedContacts}
                            value={this.dropdownValue(contact.id)}
                            />)}
                        </Form.Group>
                        </>
                    : null}
                    <Form.Input type='submit' value='Update' />
                </Form>
            </div>
            }
            </>
        )
    }
}

const mapStateToProps = state =>{
    return {
        currentUser: state.currentUser,
        currentJob: state.currentJob,
        contacts: state.contacts,
        loading: state.loading,
        currentProject: state.currentProject
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleLoad: () => dispatch({type: 'TOGGLE_LOADING'})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProject)