class ApplicationController < ActionController::Base

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

  def bearer_token
    pattern = /^Bearer /
    header  = request.headers['Authorization']
    header.gsub(pattern, '') if header && header.match(pattern)
  end
  
end
