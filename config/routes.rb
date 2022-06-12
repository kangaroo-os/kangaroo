Rails.application.routes.draw do

  # Setup API routes for devise endpoints
  mount_devise_token_auth_for 'User', at: 'auth'
  devise_for :users, skip: :all

  root 'application#index'
  post '/login', to: 'application#login'
  
  
  # API routes for files
  
  # abstract files
  get '/files/get_folder_files', to: 'abstract_files#get_folder_files', format: false
  resources :files, :controller => :abstract_files, :as => :abstract_files

  # cloud files
  resources :cloud_files
  
  # link files
  resources :link_files

  # folder files
  resources :folder_files


  get '*path', to: 'application#index'

end
