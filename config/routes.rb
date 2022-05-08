Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'

  # devise_for :users, controllers: {sessions: "sessions", registrations: "registrations"}
  
  # Setup API routes for devise endpoints
  devise_for :users, skip: :all
  # devise_scope :user do
  #   post   '/login',       to: 'sessions#create'
  #   delete '/logout',      to: 'sessions#destroy'
  #   post   '/signup',       to: 'registrations#create'
  # end

  root 'application#index'
  post '/login', to: 'application#login'
  post '/authorized', to: 'application#authorized'
  get '/get_folder_files', to: 'files#get_folder_files', format: false

  # cloud files
  get '/cloud_files/:id', to: 'cloud_files#show'
  delete '/cloud_files/:id', to: 'cloud_files#destroy'
  get '/cloud_files', to: 'cloud_files#index', defaults: {format: :json}
  post '/cloud_files/upload', to: 'cloud_files#upload'
  
  get '*path', to: 'application#index'

end
