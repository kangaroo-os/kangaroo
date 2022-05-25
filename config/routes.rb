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


  # Email Olivia link
  post '/email_olivia', to: 'application#email_olivia'

  
  get '*path', to: 'application#index'

end
