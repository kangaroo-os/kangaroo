class AddIsRootShareableToAbstractFiles < ActiveRecord::Migration[6.0]
  def change
    add_column :abstract_files, :is_root_shareable, :boolean, default: false
  end
end
