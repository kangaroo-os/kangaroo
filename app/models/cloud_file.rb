class CloudFile < AbstractFile 

  attr_accessor :tempfile

  # Makes sure the path is unique. If it's not then it will add a number to the end of the name.
  # before_validation :ensure_unique_path

  # Makes sure that adding the file is within the users GB limit.
  validate :within_gb_limit

  # Deletes the file from S3 
  after_destroy :delete_from_s3

  # Adds the files to S3 after creating the file in DB
  after_create :create_in_s3

  def create_in_s3
    S3.client.put_object(
      bucket: ENV["S3_MAIN_BUCKET"],
      key: self.path, 
      body: @tempfile,
      content_disposition: 'inline',
      content_type: self.file_type
    )
  end

  # def ensure_unique_path
  #   # eg. "/users/1/file.txt" => ["/users/1/file", ".txt"]
  #   tmp_name, extension = self.name.split(/(?=[?.!])/, 2)
  #   path_without_name = self.path.split(self.name).last

  #   if CloudFile.where(path: self.path).exists?
  #     suffix = 1
  #     until CloudFile.where(path: self.path + " " + suffix.to_s).blank?
  #       suffix += 1
  #     end
  #     self.name = tmp_name + " " + suffix.to_s + (extension || "")
  #     self.path = path_without_name + self.name
  #   end
  # end

  def delete_from_s3
    S3.client.delete_object(bucket: ENV["S3_MAIN_BUCKET"], key: self.path)
  end

  def within_gb_limit
    if self.user.is_over_gb_limit?(self.size)
      errors.add(:size, :gb_limit_reached, "GB limit reached")
      return false
    end
  end
  
end

