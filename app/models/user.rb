class User < ApplicationRecord
  # Include default devise modules.

  devise :database_authenticatable, :registerable,
          :recoverable, :rememberable, :validatable,
          :omniauthable
  
  include DeviseTokenAuth::Concerns::User
  
  has_many :file_ownerships, dependent: :destroy
  has_many :abstract_files, through: :file_ownerships
  has_many :cloud_files, -> { cloud_files }, through: :file_ownerships, source: :abstract_file
  has_many :folder_files, -> { folder_files }, through: :file_ownerships, source: :abstract_file
  has_many :link_files, -> { link_files }, through: :file_ownerships, source: :abstract_file

  after_create :create_bucket

  validates :full_name, presence: true
  validates :email, presence: true, uniqueness: true

  def create_bucket
    S3.client.put_object(bucket: ENV["S3_MAIN_BUCKET"], key: "users/#{self.id}/")
  end

  # Check if user has passed the file limit or not and return a boolean. Default 5GB 
  # Optional ability to add a file to see if adding the file will exceed the limit.
  def is_over_gb_limit?(file_size)
    cloud_files.sum(:size) + file_size > gb_limit
  end

end
