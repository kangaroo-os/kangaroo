class SessionsController < Devise::SessionsController

  # POST /login
  def create 
    super 
    cookies[:kangaroo_session_id] = session.id
    session[:token] = session.id.to_s
    session[:user_id] = current_user.id
  end

  # DELETE /logout
  def destroy
    super
  end
  
end