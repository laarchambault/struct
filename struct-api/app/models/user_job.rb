class UserJob < ApplicationRecord
  validates :permission, presence: true

  belongs_to :user
  belongs_to :job
end
