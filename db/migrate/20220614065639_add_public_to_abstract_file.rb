class AddPublicToAbstractFile < ActiveRecord::Migration[6.0]
  def change
    add_column :abstract_files, :publicly_accessible, :boolean, default: false
  end
end
