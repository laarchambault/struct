export default function reducer(state={
    currentUser: null,
    jobs: [],
    currentJob: null,
    currentProject: null,
    currentJobProjects: [],
    userProjects: [],
    items: [],
    contacts: [],
    loading: false
}, action) {
    switch(action.type) {
        case 'SET_USER':
            return {...state, currentUser: action.id};
        case 'LOGOUT':
            return {
                ...state, 
                currentUser: null, 
                jobs: [],
                currentJob: null,
                currentProject: null,
                currentJobProjects: [],
                userProjects: [],
                items: [],
                contacts: [],
            };
        case 'UPDATE_JOBS':
            return {...state, jobs: action.jobs};
        case 'SET_JOB':
            return {...state, currentJob: action.job};
        case 'SET_PROJECT':
            return {...state, currentProject: action.project};
        case 'SET_CURRENT_JOB_PROJECTS':
            return {...state, currentJobProjects: action.projects};
        case 'SET_USER_PROJECTS':
            return {...state, userProjects: action.projects};
        case 'SET_ITEMS':
            return {...state, items: action.items};
        case 'SET_CONTACTS':
            return {...state, contacts: action.contacts};
        case 'TOGGLE_LOADING':
            return {...state, loading: !state.loading}
        default:
            return state
    }
}