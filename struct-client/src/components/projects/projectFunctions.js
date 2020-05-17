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

export const statusOptions = [
    {
        key: 'Not Started',
        text: 'Not Started',
        value: 'Not Started'
    },
    {
        key: 'In Progress',
        text: 'In Progress',
        value: 'In Progress'
    },
    {
        key: 'Ready for Next Project',
        text: 'Ready for Next Project',
        value: 'Ready for Next Project'
    },
    {
        key: 'Approved',
        text: 'Approved',
        value: 'Approved'
    }
]

//used to set initial state and fill in default values in EditProject
export const returnEditStateFromProject = project => {
    let s_y, s_mo, s_d, s_h, s_mi, e_mo, e_y, e_d, e_h, e_mi
    let start = new Date(parseInt(project.start_time, 10))
    let end = new Date(parseInt(project.end_time, 10))

    s_y = start.getFullYear()
    s_mo = start.getMonth() + 1
    s_d = start.getDate()
    s_h = start.getHours()
    s_mi = start.getMinutes()
    e_y = end.getFullYear()
    e_mo = end.getMonth() + 1
    e_d = end.getDate()
    e_h = end.getHours()
    e_mi = end.getMinutes()
    return {
        name: project.name,
        s_year: s_y,
        s_month: s_mo,
        s_day: s_d,
        s_hour: s_h,
        s_minute: s_mi,
        e_year: e_y,
        e_month: e_mo,
        e_day: e_d,
        e_hour: e_h,
        e_minute: e_mi,
        sub_needs: project.sub_needs,
        status: project.status
    }
}