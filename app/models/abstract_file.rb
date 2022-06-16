class AbstractFile < ApplicationRecord

  belongs_to :owner, class_name: "User", foreign_key: :owner_id
  belongs_to :folder, class_name: "FolderFile", optional: true

  validates :name, presence: true
  validates :path, presence: true, uniqueness: true
  validates :file_type, presence: true
  validates :owner_id, presence: true
  validate :no_illegal_characters
  validates :public_share_url, uniqueness: true
  validate :ensure_consistent_shareable_states
  # Makes sure the path is unique. If it's not then it will add a number to the end of the name.
  before_validation :ensure_unique_path

  scope :cloud_files, -> { where(type: 'CloudFile') }
  scope :link_files, -> { where(type: 'LinkFile') }
  scope :folder_files, -> { where(type: 'FolderFile') }

  before_create :create_unique_share_url
  before_update :if_parent_public_make_self_public

  def icon_url
    if cloud_file? && self.file.representable?
      return self.file.representation(resize_to_fit: [100, 200]).processed.service_url
    elsif link_file? 
      return "https://www.google.com/s2/favicons?sz=128&domain_url=#{self.url}"
    end
    return nil
  end

  private 

  def if_parent_public_make_self_public
    return if self.is_root_shareable
    if self.folder != nil && self.folder.is_shareable
      self.is_shareable = true
    else
      self.is_shareable = false
    end
  end

  def create_unique_share_url
    unique_share_url = SecureRandom.urlsafe_base64(25)
    while AbstractFile.where(public_share_url: unique_share_url).count != 0
      unique_share_url = SecureRandom.urlsafe_base64(25)
    end
    self.public_share_url = unique_share_url
  end

  def ensure_unique_path
    # eg. "/users/1/file.txt" => ["/users/1/file", ".txt"]
    path_without_ext, ext = self.path.split(/(\.[^\.]+)?$/, 2)
    name_without_ext = File.basename(self.path, ext || "")

    if AbstractFile.where(path: self.path).where.not(id: self.id).exists?
      suffix = 1
      until AbstractFile.where(path: "#{path_without_ext} (#{suffix})#{ext}").empty?
        suffix += 1
      end
    end

    self.name = name_without_ext + (suffix.blank? ? "" : " (#{suffix})") + ext
    self.path = path_without_ext + (suffix.blank? ? "" : " (#{suffix})") + ext
  end

  def ensure_consistent_shareable_states
    return unless self.is_root_shareable && !self.is_shareable 
    errors.add(:is_shareable, 'must be shareable if it is root shareable')
  end

  def cloud_file?
    type == 'CloudFile'
  end

  def link_file?
    type == 'LinkFile'
  end

  def no_illegal_characters
    return unless %r{"|\.\.|\/}.match?(self.name)

    errors.add(:path, 'contains illegal characters')
  end
end
