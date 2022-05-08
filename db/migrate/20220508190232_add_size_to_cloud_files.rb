class AddSizeToCloudFiles < ActiveRecord::Migration[6.0]
  def change
    add_column :cloud_files, :size, :bigint, null: false
    add_foreign_key :cloud_files, :users
  end
end
