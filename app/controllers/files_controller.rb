class FilesController < ApplicationController
  before_action :require_login

  def upload
    params.require(:file)
    s3_client.put_object(bucket: 'kangarooo', key: "#{params[:file].original_filename}", body: params[:file].tempfile) 
  end

  def get_files
    render json: { files: s3_client.list_objects(bucket: 'kangarooo').contents.map { |f| f.key } }
  end

  private

  def require_login
    if bearer_token != session.id.to_s
      redirect_to '/'
    end
  end
end