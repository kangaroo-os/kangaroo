class RenameCloudFilesToAbstractFiles < ActiveRecord::Migration[6.0]
  def change
    rename_table :cloud_files, :abstract_files
  end
end
