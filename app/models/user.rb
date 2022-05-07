class User < ApplicationRecord
  
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :cloud_files

  after_create :create_bucket

  validates :full_name, presence: true
  validates :email, presence: true, uniqueness: true

  def create_bucket
    S3.client.put_object(bucket: ENV["S3_MAIN_BUCKET"], key: "users/#{self.id}/")
  end
end
