# frozen_string_literal: true
module ChromeAuthHelper
  PREFIX_KEY_FOR_TOKENS = 'auth/chrome_extension/verification_tokens'
  PREFIX_KEY_FOR_USERS = 'auth/chrome_extension/validated_users'

  def token_matches_user?(token)
    return false unless token.present?

    Rails.cache.read("#{PREFIX_KEY_FOR_TOKENS}/#{token}") == current_user.id
  end

  # Store IP address of browser login for extension to verify
  def prepare_to_auth_extension_user(token)
    Rails.cache.write("#{PREFIX_KEY_FOR_USERS}/#{token}", request.remote_ip, expires_in: 15.seconds)
  end
end
