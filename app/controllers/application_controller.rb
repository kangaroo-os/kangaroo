class ApplicationController < ActionController::Base

  def authorized
    if current_user 
      render json: { user: current_user }
    else
      render json: { user: nil }
    end
  end

end
