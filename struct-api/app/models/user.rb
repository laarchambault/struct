class User < ApplicationRecord
    has_secure_password

    validates :email, :password, :f_name, :l_name, presence: true
    validates :email, uniqueness: {case_sensitive: false }

    has_many :user_jobs
    has_many :jobs, through: :user_jobs
    has_many :user_projects
    has_many :projects, through: :user_projects

end
