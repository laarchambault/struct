class ChangeUsersPhoneColumnsToString < ActiveRecord::Migration[6.0]
  def up
    change_column :users, :phone, :string
    change_column :users, :company_phone, :string
  end

  def down
    change_column :users, :phone, :integer
    change_column :users, :company_phone, :integer
  end
end
