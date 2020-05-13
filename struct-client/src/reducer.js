export default function reducer(state={
    currentUser: null
}, action) {
    switch(action.type) {
        case 'LOGIN':
            return {...state, currentUser: action.id};
        case 'SIGNUP':
            return {...state, currentUser: action.id};
        default:
            return state
    }
}