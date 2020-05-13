class AddJobIdToProject < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :job_id, :integer
  end
end
