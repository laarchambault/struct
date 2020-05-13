class CreateProjects < ActiveRecord::Migration[6.0]
  def change
    create_table :projects do |t|
      t.string :name
      t.integer :start_time
      t.integer :end_time
      t.string :sub_needs
      t.string :status

      t.timestamps
    end
  end
end
