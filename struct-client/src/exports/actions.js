export const actions = {
    setCurrentUser: id => ({type: 'SET_USER', id}),
    logout: () => ({type: 'LOGOUT'}),
    setJobs: jobs => ({type: 'UPDATE_JOBS', jobs}),
    setCurrentJob: job => ({type: 'SET_JOB', job}),
    setCurrentProject: project => ({type: 'SET_PROJECT', project}),
    setCurrentJobProjects: projects => ({type: 'SET_CURRENT_JOB_PROJECTS', projects}),
    setUserProjects: projects => ({type: 'SET_USER_PROJECTS', projects}),
    setItems: items => ({type: 'SET_ITEMS', items}),
    setContacts: contacts => ({type: 'SET_CONTACTS', contacts}),
    toggleLoad: () => ({type: 'TOGGLE_LOADING'}),
}