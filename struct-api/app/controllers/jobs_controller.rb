class JobsController < ApplicationController

    def create
        job = Job.create(job_params)
        user = User.find_by(id: session[:user_id])
        if user && job.valid?
            user_job = UserJob.create(user_id: user.id, job_id: job.id, permission: params[:permission])
            copy_job = job.as_json
            copy_job["permission"] = params[:permission]
            render json: copy_job, status: :created
        else
            render json: {errors: job.errors.full_messages }, status: :bad_request
        end
    end

    def update
        job = Job.find_by(id: params[:id])
        job.update(job_params)
        if job.valid?
            user_job = UserJob.find_by(user_id: session[:user_id], job_id: job.id)
            copy_job = job.as_json
            copy_job["permission"] = user_job.permission
            render json: copy_job
        else
            render json: {error: "unable to update"}, status: :bad_request
        end

    end

    def projects
        job = Job.find_by(id: params[:id])
        if job 
            projects = job.projects
            projects_with_permissions = []

            projects.each do |project|
                user_project = UserProject.find_by(user_id: session[:user_id], project_id: project.id)
                copy_project = project.as_json
                if user_project
                    copy_project["permission"] = user_project.permission
                    projects_with_permissions.push(copy_project)
                else
                    copy_project["permission"] = nil
                    projects_with_permissions.push(copy_project)
                end
            end
            render json: projects_with_permissions
        else
            byebug
            render json: {error: "Unable to fetch projects"}, status: :not_found
        end
    end

    def delete
        job = Job.find_by(id: params[:id])
        user = User.find_by(id: session[:user_id])
        user_job = UserJob.find_by(job_id: job.id, user_id: user.id)
        
        if user_job.permission == 1
            job.destroy
            render json: {msg: 'Job deleted'}
        else
            render json: {msg: 'Unable to delete job'}
        end
    end

    private
    def job_params
        params.require(:job).permit(:name, :street_address, :city, :state)
    end

end
