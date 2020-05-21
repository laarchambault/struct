class UserJobsController < ApplicationController

    def job_contacts
        job_id = params[:id]
        params[:checkedContacts].map do |obj|
            uj = UserJob.find_by(user_id: obj[:'user_id'], job_id: job_id)
            if uj
                uj.permission = obj[:'permission']
                uj.save
            else
                UserJob.create(user_id: obj[:'user_id'], job_id: job_id, permission: obj[:'permission'])
            end
        end
        render json: {msg: 'happy path'}
    end

    # private
    # def user_job_params
    #     params.require(:user_job).permit(:job_id, :checkedContacts)
    # end
    
end
