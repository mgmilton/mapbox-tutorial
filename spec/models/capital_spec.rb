require "rails_helper"

describe Capital do
  context "validations" do
    it { is_expected.to validate_presence_of(:city)}
    it { is_expected.to validate_presence_of(:state)}

    it { is_expected.to validate_uniqueness_of(:state)}
  end

  it "can calculate the longitude and latitude coordinates" do
    # NOTE: this works because of the geocoder gem,
    # along with code in capital.rb
    capital = Capital.create(city: "Denver", state: "Colorado")

    expect(capital.city).to eql("Denver")
    expect(capital.state).to eql("Colorado")
    expect(capital.latitude).to eql(39.7392358)
    expect(capital.longitude).to eql(-104.990251)
  end
end
