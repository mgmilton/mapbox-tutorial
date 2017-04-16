require "csv"

puts "Deleting all existing items from your database..."
Capital.destroy_all

puts "Adding state capitals to your database..."
# Note that the geocoder gem, along with code in capital.rb,
# automatically calculates the latitude and longitude
# coordinates for each state capital
CSV.foreach("./db/us-state-capitals.csv", :headers => true) do |row|
  Capital.create!(city: row["Capital"],
                  state: row["State"])
end

puts "#{Capital.count} capitals added to your database!"
