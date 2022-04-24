class SessionsController < Devise::SessionsController

  def create 
    super 
    cookies[:kangaroo_session_id] = session.id
  end
  
end