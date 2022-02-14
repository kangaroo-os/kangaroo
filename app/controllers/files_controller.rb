class FilesController < ApplicationController
  before_action :require_login

  def upload
    params.require(:file)
    s3_client.put_object(bucket: 'kangarooo', key: "#{params[:file].original_filename}", body: params[:file].tempfile) 
  end

  def get_files
    render json: { files: s3_client.list_objects_v2(bucket: 'kangarooo').contents.map { |file| file.key } }
  end

  private

  def require_login
    if bearer_token != session.id.to_s
      redirect_to '/'
    end
  end
end