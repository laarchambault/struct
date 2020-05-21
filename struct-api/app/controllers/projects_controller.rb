class ProjectsController < ApplicationController

    def projects_with_permission
        #start with user_id and job_id
        user_id = session[:user_id]
        job_id = params[:job_id]
        users_projects_with_permission = {}
        #get hash of projects belonging to jobs current user owns
        u_job = UserJob.find_by(user_id: user_id, job_id: job_id, permission: 1)
        if u_job
            u_job.job.projects.each do |project|
                    users_projects_with_permission[project.id] = u_job.permission
            end
        end

        #get hash of user's user_projects
        u_projects = UserProject.where(user_id: user_id)
        u_j_projects = u_projects.select { |project| project.job.id === job_id }
        u_j_projects.each { |up| users_projects_with_permission[up.id] = up.permission}
        #return hash with (project_id: permission) pairs for all projects belonging to user
        render json: users_projects_with_permission
    end

    def create
        project = Project.new(project_params)
        if project.save
            render json: project, status: :created
        else
            render json: {errors: project.errors.full_messages }, status: :bad_request
        end
    end

    def update
        project = Project.find_by(id: params[:id])
        project.update(project_params)

        if project.save
            render json: project
        else
            render json: {error: "unable to update"}, status: :bad_request
        end
    end

    private
    def project_params
        params.require(:project).permit(:name, :start_time, :end_time, :sub_needs, :status, :job_id)
    end

end
