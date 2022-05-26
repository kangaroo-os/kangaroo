class FolderFile < AbstractFile 
  has_many :file_ownerships, foreign_key: :abstract_file_id
  has_many :users, through: :file_ownerships
end