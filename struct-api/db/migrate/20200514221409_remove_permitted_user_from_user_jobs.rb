class RemovePermittedUserFromUserJobs < ActiveRecord::Migration[6.0]
  def change
    remove_column :user_jobs, :permitted_user, :integer
  end
end
