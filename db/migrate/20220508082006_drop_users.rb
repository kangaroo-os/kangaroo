class DropUsers < ActiveRecord::Migration[6.0]
  def change
    drop_table :users, force: :cascade
  end
end
