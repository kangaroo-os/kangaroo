class CloudFilesController < AbstractFilesController
  before_action :user_authorized?, only: [:show, :destroy]
  before_action :authenticate_user!

  # POST /cloud_files
  def create 
    params.require(:file)
    name = params[:file].original_filename.to_s
    
    file = CloudFile.new({
      path: "users/#{current_user.id}/#{name}", 
      name: name, 
      file_type: params[:file].content_type, 
      size: params[:file].size, 
      tempfile: params[:file],
      owner_id: current_user.id,
    })

    if file.save!
      file.users << current_user
      render json: {file: serialize_files([file])}, status: :ok
    else
      render json: {error: "File not saved"}, status: :unprocessable_entity
    end
  end

  # GET /cloud_files
  # Used in chrome extension's file dialogue 
  def index
    serialized_files = serialize_files(current_user.cloud_files)
    render json: { files: serialized_files }, status: :ok
  end

  # GET /cloud_files/:id
  def show
    cloud_file = CloudFile.find(params[:id])
    url = cloud_file.file.service_url
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
end
