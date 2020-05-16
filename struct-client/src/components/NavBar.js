import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

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
                <h1>Hello from Navbar</h1>
                <button onClick={this.handleLogout}>Log Out</button>
            </div>
            
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch({type: 'LOGOUT'})
    }
}

export default withRouter(connect(null, mapDispatchToProps)(NavBar))