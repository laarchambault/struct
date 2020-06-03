
export const fetchCreateJob = bodyObj => {
    return fetch('http://localhost:3000/jobs', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyObj)
    })
    .then(r => {
        if(r.ok) {
            return r.json()
        } else {
            throw r
        }
    })
}

export const fetchEditJob = (id, bodyObj) => {
    return fetch(`http://localhost:3000/jobs/${id}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyObj)
    })
    .then(r => {
        if(r.ok) {
            return r.json()
        } else {
            throw r
        }
    })
}

export const fetchAssignContactsToJob = (contactObj, job_id) => {
    return fetch(`http://localhost:3000/jobs/${job_id}/contacts`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactObj)
    })
    .then(r => {
        if(r.ok) {
            return r.json()
        } else {
            throw r
        }
    })
}

export const fetchJobsAndSetState = (userId, toggleLoadAction, updateJobsAction) => {
    fetch(`http://localhost:3000/users/${userId}`, {
        credentials: 'include'
    })
    .then(r => {
        if(r.ok) {
            return r.json()
        } else {
            throw r
        }
    })
    .then(user => {
        updateJobsAction(user.jobs)
        toggleLoadAction()
    })
    .catch(() => toggleLoadAction())
}