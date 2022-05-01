class CreateCloudFiles < ActiveRecord::Migration[6.0]
  def change
    create_table :cloud_files do |t|
      t.belongs_to :user, foreign_key: true
      t.string :name
      t.string :path
      t.string :file_type
      t.timestamps
    end
  end
end
