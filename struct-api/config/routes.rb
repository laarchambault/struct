Rails.application.routes.draw do
  get '/approved_contacts', to: 'contacts#approved'
  resources :contacts, only: [:index, :create, :update]

  get '/autologin', to: 'users#autologin'
  post '/login', to: 'users#login'
  post '/logout', to: 'users#logout'
  resources :users, only: [:create, :show, :update]

  get '/projects/:id/subcontractors', to: 'projects#show_subcontractors'
  get 'projects/:id/builders', to: 'projects#show_builders'
  post '/projects/permission', to: 'projects#projects_with_permission'
  patch '/projects/:id/move', to: 'projects#update_from_timeline_drag'
  patch 'projects/:id/resize', to: 'projects#update_from_timeline_resize'
  resources :projects, only: [:create, :update, :index]

  get '/jobs/:id/projects', to: 'jobs#projects'
  resources :jobs, only: [:create, :update]
  
  get '/jobs/:id/contacts', to: 'user_jobs#show_job_contacts'
  post '/jobs/:id/contacts', to: 'user_jobs#update_job_contacts'

  get '/projects/:id/contacts', to: 'user_projects#show_project_contacts'
  post '/projects/:id/contacts', to: 'user_projects#update_project_contacts'


  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
