class UserProjectSerializer < ActiveModel::Serializer
  attributes :user

  def user
    {
      f_name: object.user.f_name,
      l_name: object.user.l_name,
      phone: object.user.phone,
      email: object.user.email,
      company: object.user.company,
      company_phone: object.user.company_phone,
      company_email: object.user.company_email,
    }
  end

  
end
