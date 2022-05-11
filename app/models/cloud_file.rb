class CloudFile < AbstractFile 

  attr_accessor :tempfile

  after_destroy :delete_from_s3
  after_create :create_in_s3

  def create_in_s3
    logger.debug "[DOG CREATED] color:#{@tempfile}"
    S3.client.put_object(
      bucket: ENV["S3_MAIN_BUCKET"],
      key: self.path, 
      body: @tempfile,
      content_disposition: 'inline',
      content_type: self.file_type
    )
  end

  def delete_from_s3
    S3.client.delete_object(bucket: ENV["S3_MAIN_BUCKET"], key: self.path)
  end
  
end

