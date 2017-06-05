import React, { Component } from 'react';
import axios from 'axios';

class Pet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pet: {},
      activePhotoSrc: ''
    }
  }

  getPet(){
    const url = `http://localhost:4567/pets_by_id/${this.props.match.params.id}`
    axios.get(url)
    .then((response) => {
      // console.log(response.data.petfinder.pet);
      this.setState({
        pet: response.data.petfinder.pet,
        activePhotoSrc: response.data.petfinder.pet.media.photos.photo[2]['$t']
      })
    })
    .catch((error) => {
      console.log(error);
    });
  }

  componentWillMount() {
    this.getPet()
  }

  renderSex(sex){
    if (sex === 'M') {
      return 'male'
    } else {
      return 'female'
    }
  }

  renderMedia() {
    return <img src={this.state.activePhotoSrc} className="img-fluid mx-auto" alt="puppers"/>
  }

  renderSlideShow() {
    const { media } = this.state.pet;
    const photos = media.photos.photo.map((photo) => {
      if (photo['@size'] === "x") {
        return (
          <div key={photo.$t} className="col-4" style={{padding:0}}>
            <img onClick={(e) => this.setState({activePhotoSrc:photo.$t})} src={photo.$t} alt="puppers" className="img-fluid img-thumbnail"/>
          </div>
        )
      }
    })
    return (<div className="row">{photos}</div>)
  }

  renderShelterInfo() {
    const { contact } = this.state.pet;
    return (
      <div>
        { contact.address1.$t } <br/> { contact.address2.$t }

        City: { contact.city.$t }, { contact.state.$t } { contact.zip.$t }
        <br/>
        Email: { contact.email.$t }
        <br/>
        Phone: { contact.phone.$t }
      </div>
    )
  }

  render() {
    const { name, age, animal, breeds, sex, size, status, options, description } = this.state.pet;
    if (name) {
      return(
        <div className="container">
          <div className="row">
            <div className="col-6 offset-3">
              <div className=" my-4">
                <h2>{name.$t} is an {age.$t.toLowerCase()} {breeds.breed.$t} {this.renderSex(sex.$t)}</h2>
              </div>
            </div>
          <div className="col-3">
          {/* work on back button  */}

          </div>
          </div>


              <div className="row">
                <div className="col-6 offset-3">
                  {this.renderMedia()}
                </div>
              </div>
              <div className="row">
                <div className="col-8 offset-2">
                  <div className="slideshow">
                    {this.renderSlideShow()}
                  </div>
                </div>
              </div>

            <div className="row">
              <div className="col-12">
              <div className="detailsBox my-3 py-4">
                <h4>Shelter Description</h4>
                {description.$t}
                <hr/>
                <h4>Contact</h4>
                {this.renderShelterInfo()}
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (<div>Loading</div>)
    }

  }

}

export default Pet;
