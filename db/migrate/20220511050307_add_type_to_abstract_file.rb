class AddTypeToAbstractFile < ActiveRecord::Migration[6.0]
  def change
    add_column :abstract_files, :type, :string
  end
end
