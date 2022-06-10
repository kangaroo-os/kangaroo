class AddUrlToAbstractFile < ActiveRecord::Migration[6.0]
  def change
    add_column :abstract_files, :url, :string, null: false
  end
end
