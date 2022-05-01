class FilesController < ApplicationController
  before_action :authenticate_user!

  def upload
    params.require(:file)
    name = params[:file].original_filename.to_s
    path = "users/#{current_user.id}/#{name}"
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

  def get_files
    # TODO:// need to build something to make sure we don't create random orphaned files. We need to check to see if the s3 bucket and the database are in sync.
    render json: { files: current_user.cloud_files }, status: :ok
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

  def delete
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
end