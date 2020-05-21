Rails.application.routes.draw do
  get '/approved_contacts', to: 'contacts#approved'
  resources :contacts, only: [:index, :create, :update]
  get '/autologin', to: 'users#autologin'
  post '/login', to: 'users#login'
  post '/logout', to: 'users#logout'
  # resources :user_projects
  post '/projects/permission', to: 'projects#projects_with_permission'
  resources :projects, only: [:create, :update, :index]
  # resources :user_jobs
  resources :jobs, only: [:create, :update]
  
  resources :users, only: [:create, :show, :update]


  get '/jobs/:id/projects', to: 'jobs#projects'
  post '/jobs/:id/contacts', to: 'user_jobs#job_contacts'


  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
