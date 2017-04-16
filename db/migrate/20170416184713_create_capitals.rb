class CreateCapitals < ActiveRecord::Migration[5.0]
  def change
    create_table :capitals do |t|
      t.text :city
      t.text :state
      t.float :latitude
      t.float :longitude

      t.timestamps null: false
    end
    add_index :capitals, :state, :unique => true
  end
end
