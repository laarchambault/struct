class Project < ApplicationRecord
    belongs_to :job
    has_many :user_jobs, through: :job
    has_many :user_projects, dependent: :destroy
    has_many :users, through: :user_projects
end
