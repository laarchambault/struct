class ContactSerializer < ActiveModel::Serializer
  attributes :id, :status
  has_one :contacter_id
  has_one :contactee_id
end
