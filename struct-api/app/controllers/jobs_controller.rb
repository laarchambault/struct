class JobsController < ApplicationController

    def create
        job = Job.create(name: params[:name], street_address: params[:street_address], city: params[:city], state: params[:state])
        user = User.find_by(id: session[:user_id])
        if user && job.valid?
            user_job = UserJob.create(user_id: user.id, job_id: job.id, permission: params[:permission])
            render json: job, status: :created
        else
            render json: {errors: job.errors.full_messages }, status: :bad_request
        end
    end

    def update
        job = Job.find_by(id: params[:id])
        job.name = params[:name]
        job.street_address = params[:street_address]
        job.city = params[:city]
        job.state = params[:state]

        if job.save
            render json: job
        else
            render json: {error: "unable to update"}, status: :bad_request
        end

    end

    def projects
        job = Job.find_by(id: params[:id])

        if job
            projects = job.projects
            render json: projects
        else
            render json: {error: "Unable to fetch projects"}, status: :not_found
        end
    end

end
