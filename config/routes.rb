Rails.application.routes.draw do
  root 'application#index'

  # Authentication stuff
  post '/login', to: 'application#login'

  resources :sessions, only: [:create]
  
  post '/authorized', to: 'application#authorized'
  post '/upload', to: 'files#upload'
  get '/files', to: 'files#get_files'
  get '*path', to: 'application#index'
end
