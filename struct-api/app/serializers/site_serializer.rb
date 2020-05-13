class SiteSerializer < ActiveModel::Serializer
  attributes :id, :name, :street_address, :city, :state
end
