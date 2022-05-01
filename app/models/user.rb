class User < ApplicationRecord
  ApplicationController.helpers.s3
  
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  after_create :create_bucket

  def create_bucket
    S3.client.put_object(bucket: ENV["S3_MAIN_BUCKET"], key: "users/#{self.id}/")
  end
end
