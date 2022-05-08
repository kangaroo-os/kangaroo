class RegistrationsController < Devise::RegistrationsController

  # POST /signup
  def create 
    super 
  end

  def after_sign_up_path_for(resource)
    '/login'
  end

end