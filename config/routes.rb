Rails.application.routes.draw do
  devise_for :users
  root 'application#index'
  post '/login', to: 'application#login'
  post '/authorized', to: 'application#authorized'
  post '/upload', to: 'files#upload'
  get '/files', to: 'files#get_files'
  get '*path', to: 'application#index'
end
