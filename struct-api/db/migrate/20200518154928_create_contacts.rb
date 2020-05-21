class CreateContacts < ActiveRecord::Migration[6.0]
  def change
    create_table :contacts do |t|
      t.integer :contacter_id
      t.integer :contactee_id
      t.integer :status

      t.timestamps
    end
  end
end
