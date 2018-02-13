Rails.application.routes.draw do
  root to: "map#index"
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :capitals, only: [:index]
    end
  end
end
