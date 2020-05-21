import React, { Component } from 'react'
import LoginForm from './LoginForm'
import Loading from '../../Loading'
import SignupForm from './SignupForm'
import { connect } from 'react-redux'


class Login extends Component {
    state={
        form: ""
    }
    render() {
        return(
            <>
            { this.props.loading ? <Loading/> :
                <div>
                    <h1>Welcome to Struct</h1>
                    <h3>Work Flow Tools for Builders to manage their construction sites</h3>
                    <button onClick={() => this.setState({form: 'log in'})}>Log In</button> or <button onClick={() => this.setState({form: 'sign up'})}>Sign up</button>
                    { this.state.form === 'log in' ? <LoginForm /> : 
                        this.state.form === 'sign up'? <SignupForm /> : null }
                </div>
            }
            </>
            
        )
    
    }
}

const mapStateToProps = state => {
    return {
        loading: state.loading
    }
}

export default connect(mapStateToProps)(Login)