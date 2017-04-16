class Capital < ApplicationRecord
  validates :city, presence: true
  validates :state, presence: true

  validates_uniqueness_of :state

  geocoded_by :city_state_and_country
  after_validation :geocode      # auto-fetch coordinates

  def city_state_and_country
    "#{city}, #{state}, US"
  end
end
