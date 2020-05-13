class User < ApplicationRecord
    has_secure_password

    has_many :user_jobs
    has_many :jobs, through: :user_jobs
    has_many :user_projects
    has_many :projects, through: :user_projects
end
