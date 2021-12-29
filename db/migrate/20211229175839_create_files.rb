class CreateFiles < ActiveRecord::Migration[6.0]
  def change
    create_table :files do |t|
      t.string :name
      t.string :type
      t.string :url
      t.string :icon

      t.timestamps
    end
  end
end
