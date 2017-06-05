require 'httparty'
require 'sinatra'
require 'sinatra/cross_origin'

require 'pry'
require 'json'

configure do
  enable :cross_origin
end

get '/' do
  'WELCOME TO THE PETFINDER PROXY SERVER'
end

get '/pets_by_zip/:zip' do
  content_type :json
  query = {
    :format => 'json',
    :key => 'd9d3840f2d36e39eea0e826e9f5062e7',
    :location => params['zip'],
    :count => 50
  }
  query[:animal] = params['animalType'] unless params['animalType'].empty?
  response = HTTParty.get("https://api.petfinder.com/pet.find",
    :query => query
  )

  b = JSON.parse response.body
  b.to_json
end

get '/pets_by_id/:id' do
  content_type :json
  query = {
    :format => 'json',
    :key => 'd9d3840f2d36e39eea0e826e9f5062e7',
    :id => params['id']
  }

  response = HTTParty.get("https://api.petfinder.com/pet.get",
    :query => query
  )

  b = JSON.parse response.body
  b.to_json
end


get '/shelter_by_zip/:zip' do
  content_type :json
  query = {
    :format => 'json',
    :key => 'd9d3840f2d36e39eea0e826e9f5062e7',
    :location => params['zip']
  }

  response = HTTParty.get("https://api.petfinder.com/shelter.find",
    :query => query
  )

  b = JSON.parse response.body
  b.to_json
end


get '/breed_listing/:animal' do
  if !['barnyard', 'bird', 'cat', 'dog', 'horse', 'pig', 'reptile', 'smallfurry'].include? params['animal']
    return "Valid animal types are barnyard, bird, cat, dog, horse, pig, reptile, smallfurry"
  end

  content_type :json
  query = {
    :format => 'json',
    :key => 'd9d3840f2d36e39eea0e826e9f5062e7',
    :animal => params['animal']
  }
  response = HTTParty.get("https://api.petfinder.com/breed.list",
    :query => query
  )
  b = JSON.parse response.body
  b.to_json
end
