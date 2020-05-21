class UserJobsController < ApplicationController

    def job_contacts
        job_id = params[:id]
        byebug
        responses = params[:checkedContacts].map do |obj|

            if UserJob.find_by(user_id: obj[:'user_id'], job_id: job_id)
                uj = UserJob.permission = obj[:'permission']
                uj.save
                byebug
                return uj
            else
                uj = UserJob.create(user_id: obj[:'user_id'], job_id: job_id, permission: obj[:'permission'])
                byebug
                return uj
            end
        end
        render json: {msg: 'happy path'}
    end

    # private
    # def user_job_params
    #     params.require(:user_job).permit(:job_id, :checkedContacts)
    # end
    
end
