class AbstractFile < ApplicationRecord

  belongs_to :owner, class_name: "User", foreign_key: :owner_id

  validates :name, presence: true
  validates :path, presence: true, uniqueness: true
  validates :file_type, presence: true
  validates :owner_id, presence: true
  # Makes sure the path is unique. If it's not then it will add a number to the end of the name.
  before_validation :ensure_unique_path

  scope :cloud_files, -> { where(type: 'CloudFile') }
  scope :link_files, -> { where(type: 'LinkFile') }
  
  def icon_url
    if cloud_file? && self.file.representable?
      return self.file.representation(resize_to_fit: [100, 200]).processed.service_url
    end
    return nil
  end

  private 

  def ensure_unique_path
    # eg. "/users/1/file.txt" => ["/users/1/file", ".txt"]
    path_without_ext, ext = self.path.split(/(?=[?.!])/, 2)
    name_without_ext = File.basename(self.path, ext || "")

    if AbstractFile.where(path: self.path).exists?
      suffix = 1
      until AbstractFile.where(path: path_without_ext + " #{suffix}" + (ext || "")).blank?
        suffix += 1
      end
    end
    self.name = name_without_ext + (suffix.blank? ? "" : " #{suffix}") + (ext || "")
    self.path = path_without_ext + (suffix.blank? ? "" : " #{suffix}") + (ext || "")
  end

  def cloud_file?
    type == 'CloudFile'
  end

  def link_file?
    type == 'LinkFile'
  end
end
