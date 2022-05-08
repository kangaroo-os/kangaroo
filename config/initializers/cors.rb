Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'localhost:3000', 'pegeejpeeihbcfnmaadambjckbgfcofc'
    resource '*', headers: :any, methods: %i[get put post delete options]
  end
end