import React, { Component } from 'react'
import LoginForm from './LoginForm'
import Loading from '../../Loading'
import SignupForm from './SignupForm'
import { connect } from 'react-redux'
import { Button, Image } from 'semantic-ui-react'
import structFull from '../../images/struct-full-logo.png'



class Login extends Component {
    state={
        form: ""
    }
    render() {
        return(
            <>
            { this.props.loading ? <Loading/> :
                <div>
                    <div className='nav heading'>
                        <Image id='logo' src={structFull} alt='logo'/>
                    </div>
                    <h3 >Work Flow Tools for Builders to manage their construction sites</h3>
                    <Button onClick={() => this.setState({form: 'log in'})}>Log In</Button> or <Button onClick={() => this.setState({form: 'sign up'})}>Sign up</Button>
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