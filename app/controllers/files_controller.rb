# frozen_string_literal: true

class FilesController < ApplicationController
  before_action :require_login

  def upload
    params.require(:file)
    s3_client.put_object(
      bucket: 'kangarooo',
      key: params[:file].original_filename.to_s,
      body: params[:file].tempfile,
      content_disposition: 'inline',
      content_type: params[:file].content_type
    )
  end

  def get_files
    render json: { files: s3_client.list_objects_v2(bucket: 'kangarooo').contents.map(&:key) }
  end

  def get_object
    params.require(:key)
    key = params[:key]
    signer = Aws::S3::Presigner.new
    url = signer.presigned_url(:get_object, bucket: 'kangarooo', key: key)
    render json: { url: url }
  end

  def delete_object
    params.require(:key)
    key = params[:key]
    s3_client.delete_object(bucket: 'kangarooo', key: key)
    render body: nil, status: :no_content
  end
  
  private

  def require_login
    redirect_to '/' if bearer_token != session.id.to_s
  end
end
