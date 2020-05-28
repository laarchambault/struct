import React, { Component } from 'react'
import swal from 'sweetalert'
import { fetchContactsAndSetState } from '../contacts/contactHelpers'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Button } from 'semantic-ui-react'

const initialState = {
    email: '',
    password: ''
}

class LoginForm extends Component {
    state=initialState


    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = e => {
        e.preventDefault()
        fetch('http://localhost:3000/login', { 
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
            this.props.submitLogin(data.id)
            fetchContactsAndSetState(this.props.addContacts)
            this.props.history.push('/jobs')

        })
        .catch(r => swal({
            title: "Invalid login. Please try again or create an account",
            icon: "error"
        }))
    }

    render() {
        return(
            <Form onSubmit={this.handleSubmit} >
                <Form.Group widths='equal'>
                <Form.Field>
                    <label>Email: </label>
                    <input type='text' name='email' value={this.state.email} onChange={this.handleChange} />
                </Form.Field>
                <Form.Field>
                    <label>Password: </label>
                    <input type='password' name='password' value={this.state.password} onChange={this.handleChange} />

                </Form.Field>
                </Form.Group>
                <Button floated='right' type='submit'>Login</Button>
            </Form>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        submitLogin: id => dispatch({type: 'SET_USER', id }),
        addContacts: contacts => dispatch({type: 'SET_CONTACTS', contacts})
    }
}

export default withRouter(connect(null, mapDispatchToProps)(LoginForm))