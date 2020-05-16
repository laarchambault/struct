export const fetchProjects = jobId => {
    return fetch(`http://localhost:3000/jobs/${jobId}/projects`, {
            credentials: "include"
        })
        .then(r => {
            if(r.ok) {
                return r.json()
            } else {
                throw r
            }
        })
}

export const createProjectItem  = (project, doubleClickCallback) => {
    return {
        id: project.id,
        group: 1,
        title: project.name,
        canMove: 'true',
        canResize: 'false',
        start_time: parseInt(project.start_time, 10),
        end_time: parseInt(project.end_time, 10),
        itemProps: {
            onDoubleClick: doubleClickCallback
        }
    }
}