class UserMailer < ApplicationMailer
  include Devise::Mailers::Helpers

  def welcome_email
    @user = params[:user]
    @url  = 'http://example.com/login'
    mail(to: @user.email, subject: 'Welcome to My Awesome Site')
  end

  def reset_password_instructions(record, token, opts={})
    # send the email to reset your password here
    # record is a User object
    # token is a unique token for resetting password
  end

  def send_complaint(user, complaint)
    return if (ENV["ENV"] != "production")
    RestClient.post "https://api:#{ENV["MAILGUN_API_KEY"]}"\
    "@api.mailgun.net/v3/sandboxa9112ce1247f4969a51901a0070f9d19.mailgun.org/messages",
    :from => "Complaining User <mailgun@sandboxa9112ce1247f4969a51901a0070f9d19.mailgun.org>",
    :to => "olivia@kangarooos.com",
    :subject => "Hello",
    :text => "#{user.full_name} <#{user.email}>is complaining. #{complaint}" 
  end
  
end
