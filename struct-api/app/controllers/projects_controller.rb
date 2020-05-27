class ProjectsController < ApplicationController

    def projects_with_permission
        user_id = session[:user_id]
        job_id = params[:job_id]
        users_projects_with_permission = []

        #get hash of user's user_projects
        u_projects = UserProject.where(user_id: user_id)
        if u_projects.length > 0
            user_projects_for_this_job = u_projects.select { |user_project| user_project.job.id === job_id }
            user_projects_for_this_job.each { |up| 
                #find the userjob where user === project job
                users_projects_with_permission.push({
                    :project_id => up.project_id,
                    :permission => up.permission
                })
            }
        end
        #return hash with (project_id: x, permission: y) pairs for all projects belonging to user
        render json: users_projects_with_permission
    end

    def create
        project = Project.new(project_params)
        if project.save
            user_project = UserProject.create(user_id: session[:user_id], project_id: project.id, permission: 1)
            copy_project = project.as_json
            copy_project["permission"] = 1
            render json: copy_project, status: :created
        else
            render json: {errors: project.errors.full_messages }, status: :bad_request
        end
    end

    def update
        project = Project.find_by(id: params[:id])
        project.update(project_params)

        if project.save
            user_project = UserProject.find_by(user_id: session[:user_id], project_id: project.id)
            copy_project = project.as_json
            copy_project["permission"] = user_project.permission
            render json: copy_project
        else
            render json: {error: "unable to update"}, status: :bad_request
        end
    end

    def update_from_timeline_drag
        project = Project.find_by(id: params[:id])
        new_start = params[:newStart]
        
        time_difference = project.start_time.to_i - new_start
        s = project.start_time.to_i - time_difference
        e = project.end_time.to_i - time_difference
        project.start_time = s.to_s
        project.end_time = e.to_s
        project.save
        user_project = UserProject.find_by(user_id: session[:user_id], project_id: project.id)
        copy_project = project.as_json
        copy_project["permission"] = user_project.permission
        render json: copy_project

    end

    def update_from_timeline_resize
        project = Project.find_by(id: params[:id])
        time = params[:time]

        if params[:edge] == 'left'
            project.start_time = time.to_s
        elsif params[:edge] == 'right'
            project.end_time = time.to_s
        end
        project.save
        user_project = UserProject.find_by(user_id: session[:user_id], project_id: project.id)
        copy_project = project.as_json
        copy_project["permission"] = user_project.permission
        render json: copy_project
    end

    def show_subcontractors
        project = Project.find_by(id: params[:id])
        user_projects = project.user_projects.where(permission: 3)
        render json: user_projects
    end

    def show_builders
        project = Project.find_by(id: params[:id])
        user_projects = project.user_projects.where(permission: 1).or(project.user_projects.where(permission: 2))
        render json: user_projects
    end

    private
    def project_params
        params.require(:project).permit(:name, :start_time, :end_time, :sub_needs, :status, :job_id)
    end

end
