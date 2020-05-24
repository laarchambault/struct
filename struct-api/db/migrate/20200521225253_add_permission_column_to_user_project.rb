class AddPermissionColumnToUserProject < ActiveRecord::Migration[6.0]
  def change
    add_column :user_projects, :permission, :integer
  end
end
