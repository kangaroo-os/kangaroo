class ApplicationMailer < ActionMailer::Base
  default from: 'Olivia Li <olivia@kangarooos.com>'
  layout 'mailer'
  
  def mail(template, opts={}) 
    to = opts[:to]
    from = opts[:from] || "Olivia Li <olivia@kangarooos.com>"
    data = opts[:data] || {}
    RestClient.post "https://api:#{ENV["MAILGUN_API_KEY"]}"\
		"@api.mailgun.net/v3/kangarooos.com/messages",
		:from => from,
		:to => to,
		:subject => opts[:subject] || "Kangaroo OS",
		:template => template,
		"h:X-Mailgun-Variables" => data.to_json
  end
end
