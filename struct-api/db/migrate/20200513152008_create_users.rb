class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :f_name
      t.string :l_name
      t.string :password_digest
      t.string :email
      t.integer :phone
      t.string :company
      t.integer :company_phone
      t.string :company_email

      t.timestamps
    end
  end
end
