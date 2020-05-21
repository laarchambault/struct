export default function reducer(state={
    currentUser: null,
    jobs: [],
    currentJob: null,
    contacts: []
}, action) {
    switch(action.type) {
        case 'SET_USER':
            return {...state, currentUser: action.id};
        case 'LOGOUT':
            return {...state, currentUser: null};
        case 'UPDATE_JOBS':
            return {...state, jobs: action.jobs};
        case 'SET_JOB':
            return {...state, currentJob: action.job};
        case 'SET_CONTACTS':
            return {...state, contacts: action.contacts};
        default:
            return state
    }
}