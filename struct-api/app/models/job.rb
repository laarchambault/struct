class Job < ApplicationRecord
    has_many :user_jobs
    has_many :users, through: :user_jobs
    has_many :projects
    # has_many :documents, through: :projects
    # has_many :blueprints
end
