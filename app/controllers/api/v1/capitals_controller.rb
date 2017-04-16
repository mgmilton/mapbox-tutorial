class Api::V1::CapitalsController < ApplicationController
  def index
    capitals = Capital.all
    render json: capitals
  end
end
