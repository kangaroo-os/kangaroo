Rails.application.routes.draw do

  # Setup API routes for devise endpoints
  mount_devise_token_auth_for 'User', at: 'auth'
  devise_for :users, skip: :all

  root 'application#index'
  post '/login', to: 'application#login'
  
  
  # API routes for files
  
  # abstract files
  put '/files/:id/move_file', to: 'abstract_files#move_file', format: false
  put '/files/:id/make_publicly_accessible', to: 'abstract_files#make_publicly_accessible', format: false
  get '/shared_files/:share_id', to: 'abstract_files#serialize_shared_files', format: false
  get '/joey/:share_id', to: 'abstract_files#get_proxied_file', format: false
  
  resources :files, :controller => :abstract_files, :as => :abstract_files

  # cloud files
  resources :cloud_files
  
  # link files
  resources :link_files

  # folder files
  resources :folder_files
  get '/folder_files/:id/get_folder_files', to: 'folder_files#get_folder_files', format: false


  get '*path', to: 'application#index'

end
