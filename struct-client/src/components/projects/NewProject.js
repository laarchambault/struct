import React from 'react'
import { convertUserToUnix } from '../../calculations/timeConversions.js'
import { connect } from 'react-redux'
import { Form } from 'semantic-ui-react'

const statusOptions = [
    {
        key: 'Not Started',
        text: 'Not Started',
        value: 'Not Started'
    },
    {
        key: 'In Progress',
        text: 'In Progress',
        value: 'In Progress'
    },
    {
        key: 'Ready for Next Project',
        text: 'Ready for Next Project',
        value: 'Ready for Next Project'
    },
    {
        key: 'Approved',
        text: 'Approved',
        value: 'Approved'
    }
]

class NewProject extends React.Component {

    state={
        name: '',
        s_year: null,
        s_month: null,
        s_day: null,
        s_hour: null,
        s_minute: null,
        e_year: null,
        e_month: null,
        e_day: null,
        e_hour: null,
        e_minute: null,
        sub_needs: '',
        status: ''
    }

    

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleDropdown = e => {
        this.setState({ status: e.target.innerText})
    }

    handleSubmit = e => {
        e.preventDefault()
        const startUnix = convertUserToUnix('start', this.state)
        const endUnix = convertUserToUnix('end', this.state)
        console.log(startUnix, endUnix)
        const bodyObj = {
            name: this.state.name,
            start_time: startUnix,
            end_time: endUnix,
            sub_needs: this.state.sub_needs,
            status: this.state.status,
            job_id: this.props.currentJob.id
        }
        fetch('http://localhost:3000/projects', {
            method: 'POST',
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
            console.log(project)
            //TODO figure out what to do with project
            //probably redirect to timeline/viewproject
        })
        .catch(error => alert(error))
    }

    componentDidMount(){
        //TODO after you establish user friends,
        //fetch users connected to currentUser
        //this.setState({ users: []})
        //create checkbox/text search in form to add subcontractors
        //set subcontractor permision level 2
    }

    render() {
        return(
            <div>
                <h1>Create New Project</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Input label='Title ' value={this.state.name} name="name" onChange={this.handleChange} />
                    
                    <h2>Project Start Time</h2>
                    <Form.Input label='Month (MO) ' type='integer' value={this.state.s_month} name="s_month" onChange={this.handleChange} /><br/>
                    <Form.Input label='Day (DD) ' type='integer' value={this.state.s_day} name="s_day" onChange={this.handleChange} /><br/>
                    <Form.Input label='Hour (HH) ' type='integer' value={this.state.s_hour} name="s_hour" onChange={this.handleChange} /><br/>
                    <Form.Input label='Minute (MM) ' type='integer' value={this.state.s_minute} name="s_minute" onChange={this.handleChange} /><br/>
                    <Form.Input label='Year (YYYY) ' type='integer' value={this.state.s_year} name="s_year" onChange={this.handleChange} /><br/>
                    
                    <h2>Project End Time</h2>
                    <Form.Input label='Month (MO) ' type='integer' value={this.state.e_month} name="e_month" onChange={this.handleChange} /><br/>
                    <Form.Input label='Day (DD) ' type='integer' value={this.state.e_day} name="e_day" onChange={this.handleChange} /><br/>
                    <Form.Input label='Hour (HH) ' type='integer' value={this.state.e_hour} name="e_hour" onChange={this.handleChange} /><br/>
                    <Form.Input label='Minute (MM) ' type='integer' value={this.state.e_minute} name="e_minute" onChange={this.handleChange} /><br/>
                    <Form.Input label='Year (YYYY) ' type='integer' value={this.state.e_year} name="e_year" onChange={this.handleChange} /><br/>

                    <h2> Subcontractor Requirements (optional) </h2>
                    <Form.Input value={this.state.sub_needs} name='sub_needs' onChange={this.handleChange} /><br/>

                    <h2>Project Status</h2>
                    <Form.Dropdown 
                        placeholder='Select Status'
                        fluid
                        seletion='true'
                        options={statusOptions}
                        onChange={this.handleDropdown}
                    /><br/><br/>
                    <Form.Input type='submit' value='Create Project' />
                </Form>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return {
        currentUser: state.currentUser,
        currentJob: state.currentJob
    }
}

export default connect(mapStateToProps)(NewProject)