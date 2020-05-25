import React from 'react';
import NavBar from './components/NavBar'
import Login from './components/login/Login'
import JobsContainer from './components/jobs/JobsContainer'
import ProjectWindow from './components/projects/ProjectWindow'
import EditJobForm from './components/jobs/EditJobForm'
import { connect } from 'react-redux'
import { Route, Switch, withRouter } from "react-router-dom";
import EditUser from './components/login/EditUser'
import './App.css';
import ContactWindow from './components/contacts/ContactWindow';
import { fetchContactsAndSetState } from './components/contacts/contactHelpers'


class App extends React.Component {

  componentDidMount() {
    this.props.toggleLoad()
    fetch('http://localhost:3000/autologin', {
      credentials: "include"
    })
    .then(r => {
      if (!r.ok) {
        throw r
      }
      return r.json()
    })
    .then(user =>{
      this.props.addUser(user.id)
      fetchContactsAndSetState(this.props.addContacts)
      this.props.toggleLoad()
      this.props.history.push('/jobs')
    })
    .catch( (error) => {
      console.error(error)
      this.props.toggleLoad()
    })
  }


  render() {
    return (
        <div className="App">
          <NavBar/>
          <Switch>
            <div>
              { this.props.currentUser && this.props.currentJob ?
                  <>
                  <Route exact path='/jobs/:id/edit' render={routeProps => <EditJobForm {...routeProps} />} />
                  <Route exact path='/jobs/:id' render={ routeProps => <ProjectWindow {...routeProps} /> } />
                  <Route exact path='/jobs' component={JobsContainer} />
                  <Route exact path='/contacts' component={ContactWindow} />
                  <Route exact path='/editProfile' component={EditUser} />

                  </> 
                :
                  this.props.currentUser ?
                    <>
                    <Route exact path='/jobs' component={JobsContainer } />
                    <Route exact path='/editProfile' component={EditUser} />
                    <Route exact path='/contacts' component={ContactWindow} />
                    </>
                    :
                    null
              }
                <Route exact path='/' component={Login }/> 

            </div>
          </Switch>
        </div>
    );
  }
  
}

const mapStateToProps = state => {
  return { 
    currentUser: state.currentUser, 
    currentJob: state.currentJob}
}

const mapDispatchToProps = dispatch => {
  return {
    addUser: id => dispatch({type: 'SET_USER', id: id}),
    addContacts: contacts => dispatch({type: 'SET_CONTACTS', contacts}),
    toggleLoad: () => dispatch({type: 'TOGGLE_LOADING'})
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
