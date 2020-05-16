class ProjectsController < ApplicationController

    def create
        project = Project.new(name: params[:name], start_time: params[:start_time], end_time: params[:end_time], sub_needs: params[:sub_needs], status: params[:status], job_id: params[:job_id])
        if project.valid?
            project.save
            render json: project, status: :created
        else
            render json: {errors: project.errors.full_messages }, status: :bad_request
        end
    end

    def update
        project = Project.find_by(id: params[:id])
        project.name = params[:name]
        project.start_time = params[:start_time]
        project.end_time = params[:end_time]
        project.sub_needs = params[:sub_needs]
        project.status = params[:status]

        if project.save
            render json: project
        else
            render json: {error: "unable to update"}, status: :bad_request
        end
    end

end
