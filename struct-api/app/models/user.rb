class User < ApplicationRecord
    has_secure_password

    validates :email, :f_name, :l_name, presence: true
    validates :email, uniqueness: true#TODO{case_sensitive: false }

    has_many :user_jobs, dependent: :destroy
    has_many :jobs, through: :user_jobs
    has_many :user_projects, dependent: :destroy
    has_many :projects, through: :user_projects

    has_many :contacter_users, foreign_key: :contactee_id, class_name: 'Contact', dependent: :destroy
    has_many :contacters, through: :contacter_users

    has_many :contactee_users, foreign_key: :contacter_id, class_name: 'Contact', dependent: :destroy
    has_many :contactees, through: :contactee_users
end
