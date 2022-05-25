class CreateNewUserFilesJoinTable < ActiveRecord::Migration[6.0]
  def change
    create_table 'file_ownerships' do |t|
      t.belongs_to 'user'
      t.belongs_to 'abstract_file'
      t.timestamps
    end

    remove_column :abstract_files, :user_id, :bigint
    add_column :abstract_files, :owner_id, :bigint
  end
end
