import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

class NavBar extends Component {

    handleLogout= () => {
        fetch('http://localhost:3000/logout', {
            method: 'POST',
            credentials: 'include'
        })
        .then(r => r.json())
        .then( () => {
            this.props.logout()
            this.props.history.push('/')
        })
    }


    render() {
        return(
            <div>
                {this.props.currentUser ? 
                    <>
                    <Button onClick={() => this.props.history.push('/editProfile')}>Profile</Button>
                    <Button onClick={this.handleLogout}>Log Out</Button>
                    <Button onClick={() => this.props.history.push('/contacts')}>Contacts</Button>
                    </>
                    :
                    null}
            </div>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch({type: 'LOGOUT'})
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar))