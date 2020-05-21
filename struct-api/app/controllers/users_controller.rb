
class UsersController < ApplicationController

    skip_before_action :authorized, only: [:create, :login]

    def create

        user = User.create(user_params)
        
        if user.valid?
            session[:user_id] = user.id 
            render json: user, status: :created
        else
            render json: {errors: user.errors.full_messages }, status: :bad_request
        end
    end

    def show
        user = User.find_by(id: session[:user_id])
        if user
            render json: user
        else
            render json: {error: "Unable to fetch user details"}
        end
    end

    def autologin
        user = User.find_by(id: session[:user_id])
        render json: user
    end

    def login
        user = User.find_by(email: params[:email])
        if user && user.authenticate(params[:password])
            session[:user_id] = user.id
            render json: user
        else
            render json: {error: "Unable to log in. Retry password or create an account"}, status: :bad_request
        end
    end

    def logout
        reset_session
        render json: { message: "Logged out" }
    end

    def update
        user = User.find_by(id: params[:id])

        user.update(user_params)
        if user
            render json: user
        else
            render json: {error: "Unable to update user"}, status: :bad_request
        end
    end

    private
    def user_params
        params.require(:user).permit(:f_name, :l_name, :password, :email, :phone, :company, :company_phone, :company_email)
    end

end
