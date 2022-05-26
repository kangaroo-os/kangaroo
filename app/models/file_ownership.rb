class FileOwnership < ApplicationRecord
  belongs_to :user
  belongs_to :abstract_file

  belongs_to :cloud_file, foreign_key: :abstract_file_id, optional: true
  belongs_to :link_file, foreign_key: :abstract_file_id, optional: true
end