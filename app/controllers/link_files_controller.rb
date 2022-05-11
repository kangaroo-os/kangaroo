class LinkFilesController < ApplicationController
  
  before_action :user_authorized?, only: [:show, :destroy]
  before_action :authenticate_user!

  # POST /cloud_files/upload
  def upload
    params.require(:link)
    name = params[:file].original_filename.to_s
    path = "users/#{current_user.id}/#{name}"
    
    LinkFile.create({
      path: path, 
      name: name, 
      file_type: "link", 
      user_id: current_user.id, 
      size: 0
    })
    
    if file.save!
      render json: {file: file}, status: :ok
    else
      render json: {error: "File not saved"}, status: :unprocessable_entity
    end

  end
  
  def get_folder_files
    params.require(:key)
    render json: { files:  S3.client.list_objects_v2(bucket: ENV["S3_MAIN_BUCKET"], prefix: "#{params[:key]}").contents.map(&:key) }
  end

  # GET /cloud_files
  def index 
    render json: { files: current_user.cloud_files }, status: :ok
  end

  # GET /cloud_files/:id
  def show
    signer = Aws::S3::Presigner.new
    url = signer.presigned_url(:get_object, bucket: ENV["S3_MAIN_BUCKET"], key: CloudFile.find(params[:id]).path)
    render json: { url: url }
  end

  # DELETE /cloud_files/:id
  def destroy 
    file = CloudFile.find(params[:id])
    if file
      file.destroy!
      render json: { message: "File deleted" }, status: :ok
    else
      render json: {error: "File not found"}, status: :not_found
    end
  end

  # POST /cloud_files/create_folder
  def create_folder
    params.require(:path)
    path, name = create_unique_name(params[:path]+"untitled folder", "untitled folder")
    S3.client.put_object(bucket: 'kangarooo', key: path + "/")
    file = CloudFile.create({path: path + "/", name: name, file_type: "folder", user_id: current_user.id, size: 0})
    render json: {file: file}, status: :ok
  end
  
  private

  def require_login
    redirect_to '/login' if !current_user
  end

  def user_authorized?
    if params.has_key?(:id)
      if current_user.cloud_file_ids.include?(params[:id].to_i)
        return true
      else
        render json: { error: "You are not authorized to access this file."}, status: :unauthorized
      end
    end
  end



end
