class AbstractFile < ApplicationRecord
  belongs_to :owner, class_name: "User", foreign_key: :owner_id
  has_many :users, through: :file_ownerships
  
  validates :name, presence: true
  validates :path, presence: true, uniqueness: true
  validates :file_type, presence: true
  validates :owner_id, presence: true
  # Makes sure the path is unique. If it's not then it will add a number to the end of the name.
  before_validation :ensure_unique_path

  private 

  def ensure_unique_path
    # eg. "/users/1/file.txt" => ["/users/1/file", ".txt"]
    tmp_name, extension = self.name.split(/(?=[?.!])/, 2)
    path_without_name = self.path.split(self.name).last

    if AbstractFile.where(path: self.path).exists?
      suffix = 1
      until AbstractFile.where(path: self.path + " " + suffix.to_s).blank?
        suffix += 1
      end
      self.name = tmp_name + " " + suffix.to_s + (extension || "")
      self.path = path_without_name + self.name
    end
  end
end
