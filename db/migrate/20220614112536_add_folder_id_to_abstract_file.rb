class AddFolderIdToAbstractFile < ActiveRecord::Migration[6.0]
  def change
    add_column :abstract_files, :folder_id, :bigint
    add_index :abstract_files, :folder_id
  end
end
