module TestHelpers

  def connection
    Faraday.new(:url => 'http://localhost:3000/')
  end

end
