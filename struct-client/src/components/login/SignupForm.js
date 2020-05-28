import React, { Component } from 'react'
import swal from 'sweetalert'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {Form, Button} from 'semantic-ui-react'

class SignupForm extends Component {

    state={
        f_name: '',
        l_name: '',
        password: '',
        confirmation_password: '',
        email: '',
        phone: '',
        company: '',
        company_phone: '',
        company_email: '',
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = e => {
        e.preventDefault()
        if (this.state.password === this.state.confirmation_password){
        fetch('http://localhost:3000/users', { 
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)

        })
        .then(r => {
            if(r.ok) {
                return r.json()
            } else {
                throw r
            }
        })
        .then(data => {
            this.props.submitSignup(data.id)
            this.props.history.push('/jobs')

        })
        .catch(error => {
            console.error(error)
            swal({
                title: "Unable to create account",
                icon: "error"
            })
        })
        } else {
            swal({
                title: "Passwords do not match",
                icon: "error"
            })
        }  
        

    }
    
    render() {
        return(
            <Form onSubmit={this.handleSubmit} >
                <input type="hidden" value="something"/>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>First Name: </label>
                        <input type='text' name='f_name' value={this.state.f_name} onChange={this.handleChange}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Last Name: </label>
                        <input type='text' name='l_name' value={this.state.l_name} onChange={this.handleChange}/>
                    </Form.Field>
                </Form.Group>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Email: </label>
                        <input type='text' name='email' value={this.state.email} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Phone: </label>
                        <input type='text' name='phone' value={this.state.phone} onChange={this.handleChange} />
                    </Form.Field>
                </Form.Group>

                <Form.Field width={8}>
                    <label>Company: </label>
                    <input type='text' name='company' value={this.state.company} onChange={this.handleChange} />
                </Form.Field>
                <Form.Group widths='equal'>
                    <Form.Field >
                        <label>Company Phone: </label>
                        <input type='text' name='company_phone' value={this.state.company_phone} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Company Email: </label>
                        <input type='text' name='company_email' value={this.state.company_email} onChange={this.handleChange} />
                    </Form.Field>
                </Form.Group>
                <br/>
                <br/>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Password: </label>
                        <input type='password' name='password' value={this.state.password} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Confirm Password: </label>
                        <input type='password' name='confirmation_password' value={this.state.confirmation_password} onChange={this.handleChange} />
                    </Form.Field>
                </Form.Group>
                
                <Button type='submit' floated='right' >Login</Button>
            </Form>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        submitSignup: id => dispatch({type: 'SET_USER', id })
    }
}

export default withRouter(connect(null, mapDispatchToProps)(SignupForm))