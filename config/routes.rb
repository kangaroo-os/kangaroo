Rails.application.routes.draw do
  root 'application#index'
  post '/login', to: 'application#login'
  get '/desktop', to: 'application#desktop'
end
