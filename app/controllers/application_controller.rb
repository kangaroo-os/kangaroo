class ApplicationController < ActionController::Base

  def login 
    if params[:password] == "nipples"
      session[:logged_in] = true
      render json: { logged_in: true }
    else
      render json: { logged_in: false }
    end
  end

  def desktop
    render layout: "application"
  end 

end
