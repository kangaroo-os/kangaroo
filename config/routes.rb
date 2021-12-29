Rails.application.routes.draw do
  root 'application#index'
  post '/login', to: 'application#login'
  get '*path', to: 'application#index'
end
