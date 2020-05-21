export const fetchContactsAndSetState = dispatch => {
    fetch('http://localhost:3000/approved_contacts', {
            credentials: 'include'
        })
        .then(r => {
            if(r.ok) {
                return r.json()
            } else {
                throw r
            }
        })
        .then(contacts => {
            dispatch(contacts)
        })
}