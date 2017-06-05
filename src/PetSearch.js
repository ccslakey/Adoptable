import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import PetsList from './PetsList';

class PetSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      zip: '95758',
      pets: [],
      breeds: [],
      animalType: 'dog'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getPets = this.getPets.bind(this);
    this.renderAnimalOptions = this.renderAnimalOptions.bind(this);
    this.handleAnimalChange = this.handleAnimalChange.bind(this);
  }

  getPets(){
    const url = `http://localhost:4567/pets_by_zip/${this.state.zip}?animalType=${this.state.animalType}`
    axios.get(url)
    .then((response) => {
      console.log(response.data.petfinder);
      this.setState({
        pets: response.data.petfinder.pets.pet
      })
    })
    .catch((error) => {
      console.log(error);
    });
  }

  componentWillMount(){
    this.getBreedList()
  }

  handleChange(event) {
    this.setState({zip: event.target.value});
  }

  handleSubmit(event) {
    if (this.state.zip.length === 5) {
      this.getPets();
    }
    event.preventDefault();
  }

  renderAnimalOptions() {
    const options = ['dog', 'cat', 'barnyard', 'bird', 'horse', 'pig', 'reptile', 'smallfurry']
    return(
      <select onChange={this.handleAnimalChange}>
        {_.map(options, opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    )
  }

  renderBreedOptions() {
    return(
      <select>
        <option key="Select One" value="Select One">Select One(Optional)</option>
        {_.map(this.state.breeds, b => <option key={b.$t} value={b.$t}> {b.$t}</option>)}
      </select>
    )
  }

  handleAnimalChange(e) {
    this.setState({
      animalType: e.target.value
    });
    this.getBreedList()
  }

  getBreedList() {
    console.log('hello');
    const url = `http://localhost:4567/breed_listing/${this.state.animalType}`
    axios.get(url)
    .then((response) => {
      console.log(response);
      this.setState({ breeds: response.data.petfinder.breeds.breed })
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <form onSubmit={this.handleSubmit}>
          <label>
            Zip Code:
            <input type="text" value={this.state.zip} onChange={this.handleChange} />
          </label>
          {this.renderAnimalOptions()}
          {this.renderBreedOptions()}
          <input type="submit" value="Submit" />
        </form>

        <PetsList pets={this.state.pets}/>
      </div>
    );
  }
}

export default PetSearch;
