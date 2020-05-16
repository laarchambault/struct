export default function reducer(state={
    currentUser: null,
    jobs: [],
    currentJob: null
}, action) {
    switch(action.type) {
        case 'LOGIN':
            return {...state, currentUser: action.id};
        case 'SIGNUP':
            return {...state, currentUser: action.id};
        case 'LOGOUT':
            return {...state, currentUser: null};
        case 'UPDATE_JOBS':
            return {...state, jobs: action.jobs};
        case 'SET_JOB':
            return {...state, currentJob: action.job};
        default:
            return state
    }
}