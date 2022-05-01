Rails.application.routes.draw do
  devise_for :users, controllers: { sessions: 'sessions' }

  root 'application#index'
  post '/login', to: 'application#login'
  post '/authorized', to: 'application#authorized'
  post '/upload', to: 'files#upload'
  get '/get_object', to: 'files#get_object', format: false
  get '/get_folder_files', to: 'files#get_folder_files', format: false
  delete '/files/:id', to: 'files#delete'
  get '/files', to: 'files#get_files'
  get '*path', to: 'application#index'
end
