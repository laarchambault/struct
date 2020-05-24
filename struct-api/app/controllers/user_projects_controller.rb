class UserProjectsController < ApplicationController

    def show_project_contacts
        user = User.find_by(id: session[:user_id])
        project_id = params[:id]
        contacts_for_this_project = []
        approved_contacts = user.get_users('approved')
        approved_contacts.each do |u|
            if u.user_projects.length > 0
                user_project = u.user_projects.select { |up| up.project_id == project_id.to_i }
                if user_project.length > 0
                    contacts_for_this_project.push(user_project[0])
                end
            end
        end
        render json: contacts_for_this_project.to_json(only: [:user_id, :permission])
    end

    def update_project_contacts 
        project_id = params[:id]
        job_id = params[:job_id]
        params[:checkedContacts].map do |obj|
            if(obj[:'permission'] == 4)
                up = UserProject.find_by(user_id: obj[:'user_id'], project_id: project_id)
                if up
                    up.destroy
                end
            else
                up = UserProject.find_or_create_by(user_id: obj[:'user_id'], project_id: project_id)
                uj = UserJob.find_or_create_by(user_id: obj[:'user_id'], job_id: job_id )
                up.permission = obj[:'permission']
                up.save
            end
            
        end
        render json: {msg: 'happy path'}
    end


end
