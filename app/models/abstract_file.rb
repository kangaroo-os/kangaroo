class AbstractFile < ApplicationRecord
  belongs_to :user
  validates :name, presence: true
  validates :path, presence: true, uniqueness: true
end
