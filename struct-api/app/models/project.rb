class Project < ApplicationRecord
    belongs_to :job
    has_many :user_projects
    has_many :users, through: :user_projects
end
