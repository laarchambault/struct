class UserSerializer < ActiveModel::Serializer
  attributes :id, :f_name, :l_name, :email, :phone, :company, :company_phone, :company_email
end
