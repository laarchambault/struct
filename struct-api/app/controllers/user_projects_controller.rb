class UserProjectsController < ApplicationController

    def project_contacts
        project_id = params[:id]
        job_id = params[:job_id]
        params[:checkedContacts].map do |obj|
            up = UserProject.find_or_create_by(user_id: obj[:'user_id'], project_id: project_id)
            uj = UserJob.find_or_create_by(user_id: obj[:'user_id'], job_id: job_id)
            uj.permission = obj[:'permission']
            uj.save
        end
        render json: {msg: 'happy path'}
    end


end
