class SessionsController < Devise::SessionsController

  def create 
    super 
    cookies[:kangaroo_session_id] = session.id
    session[:token] = session.id.to_s
    session[:user_id] = current_user.id
  end
  
end