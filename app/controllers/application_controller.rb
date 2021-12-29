class ApplicationController < ActionController::Base

  before_action :authorized_user
  skip_before_action :authorized_user, only: [:login, :index]

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
    s3_client.put_object(bucket: 'kangarooo', key: 'test.txt', body: 'Hello World!') 
    render :layout => false
  end

  def authorized
    if params[:token] == session.id.to_s
      render json: { authorized: true }
    else
      render json: { authorized: false }
    end
  end

  private 
  
  def authorized_user
    unless session[:logged_in]
      redirect_to("/")
      return false
    end
  end

  def s3_client
    s3_client ||= Aws::S3::Client.new(
      region: ENV['AWS_REGION'],
      access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
    )
  end

end
