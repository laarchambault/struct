class ChangeColumnTypeForProjects < ActiveRecord::Migration[6.0]
  def change
    change_column :projects, :start_time, :string
    change_column :projects, :end_time, :string
  end

end
