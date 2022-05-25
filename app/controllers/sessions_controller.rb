class SessionsController < Devise::SessionsController
  include ChromeAuthHelper

  # POST /login(:/chrome_auth_token)
  # def create 
  #   super 
  #   token = params[:chrome_auth_token]
  #   prepare_to_auth_extension_user(token) if token.present? && token_matches_user?(token)
  #   cookies[:kangaroo_session_id] = session.id
  #   session[:token] = session.id.to_s
  #   session[:user_id] = current_user.id
  # end

  # DELETE /logout
  # def destroy
  #   super
  # end
  

  def after_sign_out_path_for(resource_or_scope)
    request.referrer || root_path
  end
  
end