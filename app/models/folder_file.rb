class FolderFile < AbstractFile 
  has_many :file_ownerships, foreign_key: :abstract_file_id
  has_many :users, through: :file_ownerships
  has_many :children_files, class_name: "AbstractFile", foreign_key: :folder_id
end