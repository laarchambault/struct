class UserJobsController < ApplicationController

    def show_job_contacts
        user = User.find_by(id: session[:user_id])
        job_id = params[:id]
        contacts_for_this_job = []
        approved_contacts = user.get_users('approved')
        approved_contacts.each do |u|
            if u.user_jobs.length > 0
                user_job = u.user_jobs.select { |uj| uj.job_id === job_id.to_i}
                if user_job.length > 0
                    contacts_for_this_job.push(user_job[0])
                end
            end
        end
        render json: contacts_for_this_job.to_json(only: [:user_id, :permission])
    end

    def update_job_contacts
        job_id = params[:id]
        params[:checkedContacts].map do |obj|
            uj = UserJob.find_by(user_id: obj[:"user_id"], job_id: job_id)
            if(obj[:"permission"] == '4' )
                if uj
                    uj.destroy
                end
            else
                if uj
                    uj.permission = obj[:"permission"]
                    uj.save
                else
                    UserJob.create(user_id: obj[:"user_id"], job_id: job_id, permission: obj[:"permission"])
                end
            end
        end
        render json: {msg: 'happy path'}
    end


    
end
