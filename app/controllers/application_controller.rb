class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken
  
  protect_from_forgery with: :null_session, if: :json_request?
  before_action :configure_permitted_parameters, if: :devise_controller?

  def authorized
    if current_user 
      render json: { user: current_user }
    else
      render json: { user: nil }
    end
  end

  def authenticate_user_from_token
    if bearer_token 
      if session["token"].to_s == bearer_token
        @current_user = User.find(session[:user_id])
      else
        render json: { error: "Invalid token" }, status: :unauthorized
      end
    else
      authenticate_user!
    end
  end

  private

  def json_request?
    request.format.json?
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:full_name])
  end

  def bearer_token
    pattern = /^Bearer /
    header  = request.headers['Authorization']
    header.gsub(pattern, '') if header && header.match(pattern)
  end
  
end
