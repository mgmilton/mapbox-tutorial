require "rails_helper"

describe "Capitals API" do
  it "returns json of all capitals" do
    response = connection.get("/api/v1/capitals")
    capitals = JSON.parse(response.body)
    montgomery = capitals.first

    expect(response.status).to eq 200
    expect(capitals).to be_an(Array)
    expect(montgomery).to be_a(Hash)
    expect(montgomery["city"]).to eql("Montgomery")
    expect(montgomery["state"]).to eql("Alabama")
    expect(montgomery["latitude"]).to eql(32.3668052)
    expect(montgomery["longitude"]).to eql(-86.2999689)
  end
end
