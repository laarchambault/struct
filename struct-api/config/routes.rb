Rails.application.routes.draw do
  # resources :user_projects
  resources :projects, only: [:create, :update]
  # resources :user_jobs
  resources :jobs, only: [:create, :update]
  resources :users, only: [:create, :show]
  post '/login', to: 'users#login'
  post '/logout', to: 'users#logout'
  get '/autologin', to: 'users#autologin'
  get '/jobs/:id/projects', to: 'jobs#projects'


  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
