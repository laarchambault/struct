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

export const permissionOptions = id => {
    return [
    {
        key: `4 ${id}`,
        text: 'None',
        value: `4 ${id}`,
    },
    {
        key: `2 ${id}`,
        text: 'Builder: view/edit everything',
        value: `2 ${id}`,
    },
    {
        key: `3 ${id}`,
        text: 'Subcontractor: view/edit some fields',
        value: `3 ${id}`,
    }         
]}

export const subPermissionOptions = id => {
    return [
    {
        key: `4 ${id}`,
        text: 'None',
        value: `4 ${id}`,
    },
    {
        key: `3 ${id}`,
        text: 'Subcontractor: view/edit some fields',
        value: `3 ${id}`,
    }         
]}