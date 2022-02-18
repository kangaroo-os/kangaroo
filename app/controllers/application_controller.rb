class ApplicationController < ActionController::Base

  def login 
    if params[:password] == "nipples"
      session[:logged_in] = true
      cookies[:kangaroo_token] = session.id
      render json: { logged_in: true}
    else
      session[:logged_in] = false
      render json: { logged_in: false}
    end
  end

  def upload
    params.require(:file)
    if bearer_token == session.id.to_s
      s3_client.put_object(bucket: 'kangarooo', key: "#{params[:file].original_filename}_#{DateTime.now.to_i}", body: params[:file].tempfile) 
      file = 
      render :layout => false
    else
      redirect_to '/'
    end
  end

  def authorized
    if params[:token] == session.id.to_s
      render json: { authorized: true }
    else
      render json: { authorized: false }
    end
  end

  private 
  
  def bearer_token 
    pattern = /^Bearer /
    header  = request.headers['Authorization']
    token = header.gsub(pattern, '') if header && header.match(pattern)
  end

  def s3_client
    s3_client ||= Aws::S3::Client.new(
      region: ENV['AWS_REGION'],
      access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
    )
  end
end
