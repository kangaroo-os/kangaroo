# frozen_string_literal: true
class ChromeAuthController < ApplicationController
  include Devise::Controllers::Helpers

  before_action :authenticate_user!, only: [:verify_chrome_extension]

  # Gets called from the extension to intiate the sign in process
  def generate_verification_link
    # Harder to spam this endpoint by also using email to identify the user
    inferred_user = User.find_by(id: params[:id], email: params[:email])
    token = generate_urlsafe_token
    if inferred_user.present? && store_user_id(token)
      redirect_url = "/login/#{token}"
      render json: { success: true, url: redirect_url }, status: :ok
    else
      render json: { success: false }, status: :internal_server_error
    end
  end

  # Get called by extension after user logs in from browser
  def verify_chrome_extension
    if user_successfully_validated_from_same_ip?
      user = User.find(fetch_user_id_from_token(params[:chrome_auth_token]))
      invalidate_login_process_tokens
      sign_in(user)
      render json: { success: true }, status: :ok
    else
      render json: { error: "Invalid token" }, status: :unauthorized
    end
  end

  private

  def generate_urlsafe_token
    loop do
      random_token = SecureRandom.urlsafe_base64(64)
      break random_token unless collision?(random_token)
    end
  end

  def collision?(token)
    Rails.cache.read("#{PREFIX_KEY_FOR_TOKENS}/#{token}").present?
  end

  def store_user_id(token)
    Rails.cache.write("#{PREFIX_KEY_FOR_TOKENS}/#{token}", params[:user_id], expires_in: 90.seconds)
  end

  def fetch_user_id_from_token
    Rails.cache.read("#{PREFIX_KEY_FOR_TOKENS}/#{params[:chrome_auth_token]}")
  end

  # Check if user has been successfully validated from the same IP
  def user_successfully_validated_from_same_ip?
    Rails.cache.read("#{PREFIX_KEY_FOR_USERS}/#{params[:chrome_auth_token]}") == request.remote_ip
  end

  def invalidate_login_process_tokens
    token = params[:chrome_auth_token]
    Rails.cache.delete("#{PREFIX_KEY_FOR_USERS}/#{token}")
    Rails.cache.delete("#{PREFIX_KEY_FOR_TOKENS}/#{token}")
  end
end
