class AddGbLimitToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :gb_limit, :bigint, default: 5e+9, null: false
  end
end
