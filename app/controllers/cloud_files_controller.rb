class CloudFilesController < ApplicationController
  before_action :authenticate_user!
  before_action :user_authorized?, only: [:show, :destroy]

  def upload
    params.require(:file)
    name, extension = params[:file].original_filename.to_s.split(".", 2)
    invalid_path_names = CloudFile.where(user_id: current_user.id).pluck(:path)
    path = "users/#{current_user.id}/#{name}.#{extension}"
    if invalid_path_names.include?(path)
      name = name + create_unique_path(path).sub(path, "").to_s + "." + extension
      path = "users/#{current_user.id}/#{name}"
      params[:file].original_filename = name
    end
    file = CloudFile.create({path: path, name: name, file_type: params[:file].content_type, user_id: current_user.id})
    
    if file 
      S3.client.put_object(
        bucket: 'kangarooo',
        key: path, 
        body: params[:file].tempfile,
        content_disposition: 'inline',
        content_type: params[:file].content_type
      )
      render json: {file: file}, status: :ok
    else
      render json: {error: "File not saved"}, status: :unprocessable_entity
    end

  end

  def get_folder_files
    params.require(:key)
    render json: { files:  S3.client.list_objects_v2(bucket: ENV["S3_MAIN_BUCKET"], prefix: "#{params[:key]}").contents.map(&:key) }
  end

  def index 
    # TODO:// need to build something to make sure we don't create random orphaned files. We need to check to see if the s3 bucket and the database are in sync.
    render json: { files: current_user.cloud_files }, status: :ok
  end

  def show
    params.require(:id)
    signer = Aws::S3::Presigner.new
    url = signer.presigned_url(:get_object, bucket: ENV["S3_MAIN_BUCKET"], key: params[:id])
    render json: { url: url }
  end

  def destroy 
    params.require(:id)
    if CloudFile.find(params[:id]).destroy
      S3.client.delete_object(bucket: ENV["S3_MAIN_BUCKET"], key: params[:id])
      render body: nil, status: :no_content
    else 
      render json: { error: "File not deleted"}, status: :unprocessable_entity
    end
  end
  
  private

  def require_login
    redirect_to '/users/sign_in' if !current_user
  end

  def create_unique_path(path)
    if CloudFile.where(path: path).exists?
      suffix = 1
      until CloudFile.where(path: path + suffix.to_s).blank?
        suffix += 1
      end
      path + suffix.to_s
    else
      path
    end
  end

  def user_authorized?
    if params.has_key?(:id)
      if current_user.cloud_file_ids.includes(params[:id])
        return true
      else
        render json: { error: "You are not authorized to access this file."}, status: :unauthorized
      end
    end
  end
end
