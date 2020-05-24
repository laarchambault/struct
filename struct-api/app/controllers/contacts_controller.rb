class ContactsController < ApplicationController
    def index
        user = User.find_by(id: session[:user_id])
        app_contacts = user.get_users('approved')
        req_contacts = user.get_users('request')
        render json: {approved_contacts: app_contacts, request_contacts: req_contacts}
    end

    def approved
        user = User.find_by(id: session[:user_id])
        contacter_users = user.contacter_users.where(status: 1)
        contactee_users = user.contactee_users.where(status: 1)
        contacters = contacter_users.map { |c| c.contacter}
        contactees = contactee_users.map { |c| c.contactee}
        contacts = contactees + contacters

        render json: contacts
    end

    def create
        if User.find_by(email: params[:email])
            user_id = session[:user_id]
            contactee_id = User.find_by(email: params[:email]).id
        
            #check if Contact exists between users
            already_sent = Contact.find_by(contactee_id: contactee_id, contacter_id: user_id)
            already_received = Contact.find_by(contacter_id: contactee_id, contactee_id: user_id)

            if already_sent
                render json: {msg: "You've already made this request"}
            elsif already_received
                already_received.status = 1
                if already_received.save
                    render json: {msg: "Request approved"}
                end
            else 
                new_contact = Contact.create(contactee_id: contactee_id, contacter_id: user_id, status: 0)
                if new_contact
                    render json: {msg: "Request sent"}
                else
                    render json: {msg: "Unable to process request"}
                end
            end
        else
            render json: {msg: "There's no user in our system with that email address"}
        end
    end

    def update
        user = session[:user_id]
        contact = params[:id]
        response = params[:response]
        contact_record = Contact.where(contactee_id: user, contacter_id: contact).or(Contact.where(contacter_id: user, contactee_id: contact))[0]
        if response == 'add'
            contact_record.status = 1
            if contact_record.save
                render json: contact_record
            else
                render json: {error: "unable to add friend"}, status: :bad_request
            end
        elsif response == 'delete'
            contact_record.destroy
            render json: {msg: 'friend request removed'}
        else
            render json: {msg: 'unable to update response'}
        end

    end


end
