Rails.application.routes.draw do
  
  #Setup API routes for devise endpoints
  devise_for :users, skip: :all
  devise_scope :user do
    post   '/login',       to: 'sessions#create'
    delete '/logout',      to: 'sessions#destroy'
    post   '/sign_up',       to: 'registrations#create'
  end

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
