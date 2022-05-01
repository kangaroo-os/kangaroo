class FilesController < ApplicationController
  before_action :authenticate_user!

  def upload
    params.require(:file)
    S3.client.put_object(
      bucket: 'kangarooo',
      key:  "users/#{current_user.id}/" + params[:file].original_filename.to_s,
      body: params[:file].tempfile,
      content_disposition: 'inline',
      content_type: params[:file].content_type
    )
  end

  def get_files
    render json: { files:  S3.client.list_objects_v2(bucket: ENV["S3_MAIN_BUCKET"], prefix: "users/#{current_user.id}/").contents.map(&:key) }
  end

  def get_folder_files
    params.require(:key)
    render json: { files:  S3.client.list_objects_v2(bucket: ENV["S3_MAIN_BUCKET"], prefix: "#{params[:key]}").contents.map(&:key) }
  end

  def get_object
    params.require(:key)
    key = params[:key]
    signer = Aws::S3::Presigner.new
    url = signer.presigned_url(:get_object, bucket: ENV["S3_MAIN_BUCKET"], key: key)
    render json: { url: url }
  end

  def delete_object
    params.require(:key)
    key = params[:key]
    S3.client.delete_object(bucket: ENV["S3_MAIN_BUCKET"], key: key)
    render body: nil, status: :no_content
  end
  
  private

  def require_login
    redirect_to '/users/sign_in' if !current_user
  end
end
