import React from 'react';
import _ from 'lodash';
import PetResult from './PetResult'

const PetsList = (props) => {
  if (props.pets.length > 0) {
    const renderedPets = _.map(props.pets, (pet) => {
      return (
        <div className="col-4">
          <PetResult pet={pet} key={pet.id.$t}/>
        </div>
        )
    })


    return (
      <div className='row'>
        {renderedPets}
      </div>
    )
  } else {
    return (
      <div>No pets found with that criteria</div>
    )
  }
}

export default PetsList;
