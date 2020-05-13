class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :name, :start_time, :end_time, :sub_needs, :status
end
