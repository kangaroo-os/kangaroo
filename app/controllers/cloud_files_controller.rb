class CloudFilesController < ApplicationController
  before_action :user_authorized?, only: [:show, :destroy]
  before_action :authenticate_user!

  # POST /cloud_files
  def create 
    params.require(:file)
    name = params[:file].original_filename.to_s
    path = "users/#{current_user.id}/#{name}"
    
    file = CloudFile.new({
      path: path, 
      name: name, 
      file_type: params[:file].content_type, 
      size: params[:file].size, 
      tempfile: params[:file].tempfile,
      owner_id: current_user.id,
    })

    if file.save!
      file.users << current_user
      render json: {file: file}, status: :ok
    else
      render json: {error: "File not saved"}, status: :unprocessable_entity
    end
  end

  # GET /cloud_files
  def index 
    render json: { files: current_user.cloud_files }, status: :ok
  end

  # GET /cloud_files/:id
  def show
    signer = Aws::S3::Presigner.new
    cloud_file = CloudFile.find(params[:id])
    url = signer.presigned_url(:get_object, bucket: ENV["S3_MAIN_BUCKET"], key: cloud_file.path)
    render json: { url: url, name: cloud_file.name, file_type: cloud_file.file_type }
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

  # # POST /cloud_files/create_folder
  # def create_folder
  #   params.require(:path)
  #   path, name = create_unique_name(params[:path]+"untitled folder", "untitled folder")
  #   S3.client.put_object(bucket: 'kangarooo', key: path + "/")
  #   file = CloudFile.create({path: path + "/", name: name, file_type: "folder", user_id: current_user.id, size: 0})
  #   render json: {file: file}, status: :ok
  # end
  
  private

  def user_authorized?
    if params.has_key?(:id)
      if current_user.abstract_file_ids.include?(params[:id].to_i)
        return true
      else
        render json: { error: "You are not authorized to access this file."}, status: :unauthorized
      end
    end
  end



end
