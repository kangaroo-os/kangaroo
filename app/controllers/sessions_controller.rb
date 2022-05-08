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
  

  def after_sign_out_path_for(resource_or_scope)
    request.referrer || root_path
  end
  
end