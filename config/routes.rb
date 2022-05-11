Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'

  # Setup API routes for devise endpoints
  devise_for :users, skip: :all
  # devise_scope :user do
  #   post   '/login',       to: 'sessions#create'
  #   delete '/logout',      to: 'sessions#destroy'
  #   post   '/signup',       to: 'registrations#create'
  # end

  root 'application#index'
  post '/login', to: 'application#login'
  get '/get_folder_files', to: 'files#get_folder_files', format: false

  
  # API routes for files
  
  # abstract files
  get '/files', to: 'abstract_files#index'
  delete '/files/:id', to: 'abstract_files#destroy'

  # cloud files
  get '/cloud_files/:id', to: 'cloud_files#show'
  delete '/cloud_files/:id', to: 'cloud_files#destroy'
  get '/cloud_files', to: 'cloud_files#index'
  post '/cloud_files/upload', to: 'cloud_files#upload'
  post '/cloud_files/create_folder', to: 'cloud_files#create_folder' 

  # link files
  get '/link_files/:id', to: 'link_files#show'
  delete '/link_files/:id', to: 'link_files#destroy'
  get '/link_files', to: 'link_files#index'
  post '/link_files/upload', to: 'link_files#upload'

  
  get '*path', to: 'application#index'

end
