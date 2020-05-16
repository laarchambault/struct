import React from 'react';
import NavBar from './components/NavBar'
import Login from './components/login/Login'
import JobsContainer from './components/jobs/JobsContainer'
import ProjectsContainer from './components/projects/ProjectsContainer'
import EditJobForm from './components/jobs/EditJobForm'
import { connect } from 'react-redux'
import { Route, Switch, withRouter } from "react-router-dom";

import './App.css';



class App extends React.Component {

  componentDidMount() {
    fetch('http://localhost:3000/key')
    .then(r => r.json())
    .then(r => console.log(r))
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
      this.props.history.push('/jobs')
    })
    .catch(console.error)
  }


  render() {
    return (
        <div className="App">
          <NavBar/>
          <Switch>
            <div>
              {
                this.props.currentUser && this.props.currentJob ?
                  <>
                  <Route exact path='/jobs/:id/edit' render={routeProps => <EditJobForm {...routeProps} />} />
                  <Route exact path='/jobs/:id' render={ routeProps => <ProjectsContainer {...routeProps} /> } />
                  <Route exact path='/jobs' component={JobsContainer} />
                  </> 
                :
                  this.props.currentUser ?
                    <Route exact path='/jobs' component={JobsContainer } />
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
  return { currentUser: state.currentUser, currentJob: state.currentJob }
}

const mapDispatchToProps = dispatch => {
  return {
    addUser: id => dispatch({type: 'LOGIN', id: id})
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
