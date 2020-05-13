import React, { Component } from 'react'
import { connect } from 'react-redux'

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
        .then(r => r.json())
        .then(data => {
            this.props.submitLogin(data.id)
            console.log(data);
            debugger

        })
        .catch(error => alert(error))
        //render user or error message
        // this.props.submitSignup(currentUser)
        //.catch alert error message
    }

    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <label>Email:
                    <input type='text' name='email' value={this.state.email} onChange={this.handleChange} />
                </label>
                <label>Password:
                    <input type='password' name='password' value={this.state.password} onChange={this.handleChange} />
                </label>
                <input type='submit' value='Login'/>
            </form>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        submitLogin: id => dispatch({type: 'LOGIN', id })
    }
}

export default connect(null, mapDispatchToProps)(LoginForm)