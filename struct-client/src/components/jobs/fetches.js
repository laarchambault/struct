//TODO: delete file if not being used

// export const fetchProjectsAndReturnState = () => {
//     const handleDoubleClick = e => {
//         console.log(e)
//         debugger
//     }
    
//     fetch(`http://localhost:3000/jobs/${this.props.jobId}/projects`, {
//             credentials: "include"
//         })
//         .then(r => {
//             if(r.ok) {
//                 return r.json()
//             } else {
//                 throw r
//             }
//         })
//         .then(projects => {
//             let items = projects.map( project => {
//                 return {
//                     id: project.id,
//                     group: 1,
//                     title: project.name,
//                     start_time: parseInt(project.start_time, 10),
//                     end_time: parseInt(project.end_time, 10),
//                     itemProps: {
//                         'data-id': project.id,
//                         onDoubleClick: () => handleDoubleClick()
//                     }
//                 }
//             })
//             debugger
//             this.setState({ projects: projects, items: items})
//         })
//         .catch(error => console.log(error))

// }