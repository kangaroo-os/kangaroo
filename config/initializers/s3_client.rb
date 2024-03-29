class S3
  
  def self.client
    @client ||= Aws::S3::Client.new(
      region: ENV['AWS_REGION'],
      access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
    )
  end

  def self.bucket 
    @bucket ||= Aws::S3::Bucket.new(ENV['S3_MAIN_BUCKET'])
  end 
  
end