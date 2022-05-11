class CloudFilesController < ApplicationController
  before_action :user_authorized?, only: [:show, :destroy]
  before_action :authenticate_user!

  # POST /cloud_files/upload
  def upload
    params.require(:file)
   
    # If the user has reached their storage limit forbid upload
    if is_over_gb_limit?(current_user.gb_limit, params[:file].size)
      render json: {error: "Storage GB limit reached"}, status: :method_not_allowed
      return
    end
    
    name = params[:file].original_filename.to_s
    invalid_path_names = CloudFile.where(user_id: current_user.id).pluck(:path)
    path = "users/#{current_user.id}/#{name}"

    # If the file already exists, append a number to the end of the file name
    if invalid_path_names.include?(path)
      path, name = create_unique_name(path, name) 
      params[:file].original_filename = name
    end
    
    file = CloudFile.new({path: path, name: name, file_type: params[:file].content_type, user_id: current_user.id, size: params[:file].size})
    file.tempfile = params[:file]
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
    # TODO:// need to build something to make sure we don't create random orphaned files. We need to check to see if the s3 bucket and the database are in sync.
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
    path = CloudFile.find(params[:id]).path
    begin CloudFile.find(params[:id]).destroy
      S3.client.delete_object(bucket: ENV["S3_MAIN_BUCKET"], key: path)
      render body: nil, status: :no_content
    rescue StandardError => e 
      render json: { error: "File not deleted: #{e}}"}, status: :unprocessable_entity
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

  def create_unique_name(path, filename)

    # eg. "/users/1/file.txt" => ["/users/1/file", ".txt"]
    name, extension = filename.split(/(?=[?.!])/, 2)
    path_without_name = path.split(filename).last
    if CloudFile.where(path: path).exists?
      suffix = 1
      until CloudFile.where(path: path + " " + suffix.to_s).blank?
        suffix += 1
      end
      new_name = name + " " + suffix.to_s + (extension || "")
      return [path_without_name + new_name, new_name]
    else
      return [path, filename]
    end
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


  # Check if user has passed the file limit or not and return a boolean. Default 5GB 
  # Optional ability to add a file to see if adding the file will exceed the limit.
  def is_over_gb_limit?(limit=5e+9, file_size=0)
    current_user.cloud_files.sum(:size) + file_size > limit 
  end

end
