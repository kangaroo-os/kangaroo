require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Kangaroo
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    config.action_controller.action_on_unpermitted_parameters = :log

    config.action_mailer.delivery_method = :smtp
    config.action_mailer.smtp_settings = {
      :authentication => :plain,
      :address => "smtp.mailgun.org",
      :port => 587,
      :domain => ENV["MAILGUN_DOMAIN"],
      :user_name => ENV["MAILGUN_USERNAME"],
      :password => ENV["MAILGUN_PASSWORD"]
    }

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
  end
end
