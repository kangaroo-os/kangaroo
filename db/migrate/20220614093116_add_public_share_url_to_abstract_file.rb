class AddPublicShareUrlToAbstractFile < ActiveRecord::Migration[6.0]
  def change
    add_column :abstract_files, :public_share_url, :string
  end
end
