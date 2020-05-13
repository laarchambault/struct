class UserJobSerializer < ActiveModel::Serializer
  attributes :id, :permitted_user, :permission
  has_one :user
  has_one :site
end
