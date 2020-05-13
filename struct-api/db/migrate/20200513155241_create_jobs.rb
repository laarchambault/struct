class CreateJobs < ActiveRecord::Migration[6.0]
  def change
    create_table :jobs do |t|
      t.string :name
      t.string :street_address
      t.string :city
      t.string :state

      t.timestamps
    end
  end
end
