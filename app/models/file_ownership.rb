class FileOwnership < ApplicationRecord
  belongs_to :user
  belongs_to :abstract_file
end