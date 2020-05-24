class User < ApplicationRecord
    has_secure_password

    validates :email, :f_name, :l_name, presence: true
    validates :email, uniqueness: true#TODO{case_sensitive: false }

    has_many :user_jobs, dependent: :destroy
    has_many :jobs, through: :user_jobs
    has_many :user_projects, dependent: :destroy
    has_many :projects, through: :user_projects

    has_many :contacter_users, foreign_key: :contactee_id, class_name: 'Contact', dependent: :destroy
    has_many :contacters, through: :contacter_users

    has_many :contactee_users, foreign_key: :contacter_id, class_name: 'Contact', dependent: :destroy
    has_many :contactees, through: :contactee_users


    def get_users(approved_or_request)
        if approved_or_request == 'approved'
            status = 1
            contactees_in_join_table = Contact.where(contacter_id: self.id, status: status)
            contacters_in_join_table = Contact.where(contactee_id: self.id, status: status)
            contactees = contactees_in_join_table.map { |c| User.find_by(id: c.contactee_id)}
            contacters = contacters_in_join_table.map { |c| User.find_by(id: c.contacter_id)}
            final = contactees.concat(contacters)
        else
            status = 0 
            contacters_in_join_table = Contact.where(contactee_id: self.id, status: status)
            contacters = contacters_in_join_table.map { |c| User.find_by(id: c.contacter_id)}
            final = contacters
        end
        return final
    end

end
