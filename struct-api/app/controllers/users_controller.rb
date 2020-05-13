class UsersController < ApplicationController

    skip_before_action :authorized, only: [:create, :login]

    def create
        user = User.create(f_name: params[:f_name], l_name: params[:l_name], email: params[:email], phone: params[:phone], company: params[:company], company_phone: params[:company_phone], company_email: params[:company_email], password: params[:password])
        
        if user.valid?
            session[:user_id] = user.id 
            render json: user, status: :created
        else
            render json: {errors: user.errors.full_messages }, status: :bad_request
        end
    end

    def login
        user = User.find_by(email: params[:email])
        if user && user.authenticate(params[:password])
            render json: user
        else
            render json: {error: "Unable to log in. Retry password or create an account"}, status: :bad_request
        end
    end

end
