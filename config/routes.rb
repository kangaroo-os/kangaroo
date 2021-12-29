Rails.application.routes.draw do
  root 'application#index'
  post '/login', to: 'application#login'
  post '/authorized', to: 'application#authorized'
  get '*path', to: 'application#index'
end
