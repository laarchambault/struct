class UserProject < ApplicationRecord
  belongs_to :user
  belongs_to :project
  has_one :job, through: :project
end
