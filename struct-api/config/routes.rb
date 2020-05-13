Rails.application.routes.draw do
  # resources :user_projects
  # resources :projects
  # resources :user_jobs
  # resources :jobs
  resources :users
  post '/login', to: 'users#login'
  

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
