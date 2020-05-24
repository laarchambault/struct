import React from 'react'
import { convertUserToUnix } from '../../calculations/timeConversions.js'
import { connect } from 'react-redux'
import { Form } from 'semantic-ui-react'
import { statusOptions, returnEditStateFromProject, fetchAssignContactsToProject } from './projectFunctions'
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
        checkedContacts: []
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
        //filter checkedContacts by permission greater than current user
        const lowerChecked = [...this.state.checkedContacts].filter( record => 
            record.permission <= this.props.project.permission)
        const idsOnlyLowerChecked = lowerChecked.map(contactObj => contactObj.user_id)
        //filter contacts by contained in filtered checkedContacts
        return this.props.contacts.filter(contact => 
            !idsOnlyLowerChecked.includes(contact.id)
            )
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
        fetch(`http://localhost:3000/projects/${this.props.project.id}`, {
            method: 'PUT',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyObj)
        })
        .then(r => {
            if(r.ok) {
                return r.json()
            } else {
                throw r
            }
        })
        .then(project => {
            const contactObj = {
                checkedContacts: this.state.checkedContacts, 
                job_id: this.props.currentJob.id
            }
            fetchAssignContactsToProject(contactObj, project.id)
            this.props.updateUsers(this.props.currentJob.id, 'show')
            this.props.setView(project)
        })
        .catch(error => console.log(error))
    }

    componentDidMount() {
        this.props.toggleLoad()
        this.setState(returnEditStateFromProject(this.props.project))
        this.getContactsForThisProject(this.props.project.id)//used to prepopulate edit form with user permissions
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

    render() {
        let {permission} = this.props.currentJob
        let project_permission = this.props.project.permission
        return(
            <>
            {this.props.loading ? <Loading/> :
                <div>
                <h1>Edit Project</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Input 
                        label='Title ' 
                        value={this.state.name} 
                        name="name" 
                        onChange={this.handleChange} 
                        disabled={ permission === 1 ? false : true}
                        />
                    
                    <h2>Project Start Time</h2>
                    <Form.Input 
                        label='Month (MO) ' 
                        type='integer' 
                        value={this.state.s_month} 
                        name="s_month" 
                        onChange={this.handleChange} 
                        disabled={ permission === 1 || permission === 2 ? false : true}
                        /><br/>
                    <Form.Input 
                        label='Day (DD) ' 
                        type='integer' 
                        value={this.state.s_day} 
                        name="s_day" 
                        onChange={this.handleChange} 
                        disabled={ permission === 1 || permission === 2 ? false : true}
                        /><br/>
                    <Form.Input 
                        label='Hour (HH) ' 
                        type='integer' 
                        value={this.state.s_hour} 
                        name="s_hour" 
                        onChange={this.handleChange} 
                        disabled={ permission === 1 || permission === 2 ? false : true}
                        /><br/>
                    <Form.Input 
                        label='Minute (MM) ' 
                        type='integer' 
                        value={this.state.s_minute} 
                        name="s_minute" 
                        onChange={this.handleChange} 
                        disabled={ permission === 1 || permission === 2 ? false : true}
                        /><br/>
                    <Form.Input 
                        label='Year (YYYY) ' 
                        type='integer' 
                        value={this.state.s_year} 
                        name="s_year" 
                        onChange={this.handleChange} 
                        disabled={ permission === 1 || permission === 2 ? false : true}
                        /><br/>
                    
                    <h2>Project End Time</h2>
                    <Form.Input 
                        label='Month (MO) ' 
                        type='integer' 
                        value={this.state.e_month} 
                        name="e_month" 
                        onChange={this.handleChange} 
                        disabled={ permission === 1 || permission === 2 ? false : true}
                        /><br/>
                    <Form.Input 
                        label='Day (DD) ' 
                        type='integer' 
                        value={this.state.e_day} 
                        name="e_day" 
                        onChange={this.handleChange} 
                        disabled={ permission === 1 || permission === 2 ? false : true}
                        /><br/>
                    <Form.Input 
                        label='Hour (HH) ' 
                        type='integer' 
                        value={this.state.e_hour} 
                        name="e_hour" 
                        onChange={this.handleChange} 
                        disabled={ permission === 1 || permission === 2 ? false : true}
                        /><br/>
                    <Form.Input 
                        label='Minute (MM) ' 
                        type='integer' 
                        value={this.state.e_minute} 
                        name="e_minute" 
                        onChange={this.handleChange} 
                        disabled={ permission === 1 || permission === 2 ? false : true}
                        /><br/>
                    <Form.Input 
                        label='Year (YYYY) ' 
                        type='integer' 
                        value={this.state.e_year} 
                        name="e_year" 
                        onChange={this.handleChange} 
                        disabled={ permission === 1 || permission === 2 ? false : true}
                        /><br/>

                    <h2> Subcontractor Requirements (optional) </h2>
                    <Form.Input value={this.state.sub_needs} name='sub_needs' onChange={this.handleChange} /><br/>

                    <h2>Project Status</h2>
                    <Form.Dropdown 
                        placeholder='Select Status'
                        fluid
                        seletion='true'
                        options={statusOptions}
                        onChange={this.handleDropdown}
                        disabled={ permission === 1 || permission === 2 ? false : true}
                    /><br/><br/>
                    {this.contactsWithLowerOrEqualPermissionThanCurrentUser().length > 0 ?
                        <>
                        <h2>Add Users to This Project </h2>
                        {this.contactsWithLowerOrEqualPermissionThanCurrentUser().map(contact => 
                            <ProjectContactAssignForm 
                            contact={contact}
                            permission={project_permission}
                            handleChange={this.handleContactChange} 
                            checkedContacts={this.state.checkedContacts}
                            value={this.dropdownValue(contact.id)}
                            />)}
                        
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
        loading: state.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleLoad: () => dispatch({type: 'TOGGLE_LOADING'})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProject)