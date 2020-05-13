import React, { Component } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

export default class Login extends Component {
    state={
        form: ""
    }
    render() {
        return(
            <div>
                <h1>Welcome to Struct</h1>
                <h3>Work Flow Tools for Builders to manage their construction sites</h3>
                <button onClick={() => this.setState({form: 'log in'})}>Log In</button> or <button onClick={() => this.setState({form: 'sign up'})}>Sign up</button>
                { this.state.form === 'log in' ? <LoginForm/> : 
                    this.state.form === 'sign up'? <SignupForm/> : null }
            </div>
            
            
            //on submit, dispatch 'ADD_USER' or 'LOG_IN'. dispatch should receive user credentials
            //from rails and set state current_user.
        )
    }
}