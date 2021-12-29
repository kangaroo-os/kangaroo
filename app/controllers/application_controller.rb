class ApplicationController < ActionController::Base

  before_action :authorized_user
  skip_before_action :authorized_user, only: [:login, :index]

  def login 
    if params[:password] == "nipples"
      session[:logged_in] = true
      render json: { logged_in: true }
    else
      session[:logged_in] = false
      render json: { logged_in: false }
    end
  end

  def desktop
    render layout: "application"
  end 

  private 
  
  def authorized_user
    unless session[:logged_in]
      redirect_to("/")
      return false
    end
  end

end
