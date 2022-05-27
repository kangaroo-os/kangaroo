class CloudFile < AbstractFile 
  has_many :file_ownerships, foreign_key: :abstract_file_id
  has_many :users, through: :file_ownerships

  attr_accessor :tempfile

  # Makes sure that adding the file is within the owners GB limit.
  validate :within_gb_limit?

  # Deletes the file from S3 
  after_destroy :delete_from_s3

  # Adds the files to S3 after creating the file in DB
  after_create :create_in_s3

  before_update :rename_in_s3

  def create_in_s3
    S3.client.put_object(
      bucket: ENV["S3_MAIN_BUCKET"],
      key: self.path, 
      body: @tempfile,
      content_disposition: 'inline',
      content_type: self.file_type
    )
  end

  def rename_in_s3 
    if self.path_changed?
      object = S3.bucket.object(self.path_was)
      object.move_to(bucket: ENV["S3_MAIN_BUCKET"], key: self.path)
    end
  end

  def delete_from_s3
    S3.client.delete_object(bucket: ENV["S3_MAIN_BUCKET"], key: self.path)
  end

  def within_gb_limit?
    if self.owner.is_over_gb_limit?(self.size)
      errors.add(:size, :gb_limit_reached, "GB limit reached")
    end
  end
  
end
