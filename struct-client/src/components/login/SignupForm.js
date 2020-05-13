import React, { Component } from 'react'
import { connect } from 'react-redux'

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
        .then(r => r.json())
        .then(data => {
            this.props.submitSignup(data.id)
            console.log(data);
            debugger

        })
        .catch(error => alert(error))
        } else {
            alert("Passwords do not match")
        }  
        
        //render user or error message
        // this.props.submitSignup(currentUser)
        //.catch alert error message
    }

    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <label>First Name:
                    <input type='text' name='f_name' value={this.state.f_name} onChange={this.handleChange}/>
                </label><br/>
                <label>Last Name:
                    <input type='text' name='l_name' value={this.state.l_name} onChange={this.handleChange}/>
                </label><br/>
                <label>Email:
                    <input type='text' name='email' value={this.state.email} onChange={this.handleChange} />
                </label><br/>
                <label>Phone:
                    <input type='text' name='phone' value={this.state.phone} onChange={this.handleChange} />
                </label><br/>
                <label>Company:
                    <input type='text' name='company' value={this.state.company} onChange={this.handleChange} />
                </label><br/>
                <label>Company Phone:
                    <input type='text' name='company_phone' value={this.state.company_phone} onChange={this.handleChange} />
                </label><br/>
                <label>Company Email:
                    <input type='text' name='company_email' value={this.state.company_email} onChange={this.handleChange} />
                </label><br/><br/><br/>
                <label>Password:
                    <input type='password' name='password' value={this.state.password} onChange={this.handleChange} />
                </label><br/>
                <label>Confirm Password:
                    <input type='password' name='confirmation_password' value={this.state.confirmation_password} onChange={this.handleChange} />
                </label>
                <input type='submit' value='Login'/>
            </form>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        submitSignup: id => dispatch({type: 'SIGNUP', id })
    }
}

export default connect(null, mapDispatchToProps)(SignupForm)