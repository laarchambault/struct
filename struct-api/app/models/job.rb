class Job < ApplicationRecord
    validates :name, :street_address, :city, :state, presence: true

    has_many :user_jobs, dependent: :destroy
    has_many :users, through: :user_jobs
    has_many :projects, dependent: :destroy
    # has_many :documents, through: :projects
    # has_many :blueprints
end
