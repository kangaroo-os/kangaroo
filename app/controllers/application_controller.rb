class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken

  before_action :authenticate_user!, only: [:email_olivia]
  
  protect_from_forgery with: :null_session, if: :json_request?
  before_action :configure_permitted_parameters, if: :devise_controller?

  def json_request?
    request.format.json?
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:full_name])
  end

  def email_olivia
    params.require(:complaint)
    UserMailer.new().send_complaint(current_user, params[:complaint])
  end

end
