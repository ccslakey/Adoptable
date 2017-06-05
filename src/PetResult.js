import React from 'react';
import { Link } from 'react-router-dom'

const PetResult = (props) => {
  const { pet } = props;
  const imgSrc = pet.media.photos.photo[2]['$t'] || pet.media.photos.photo[0]['$t'] || ''
  return (
      <Link to={`/pet/${pet.id.$t}`} key={pet.id.$t} >
        <img src={imgSrc} className="img-responsive img-thumbnail"/>
        <br/>
        {pet.name.$t}
      </Link>
  )
}

export default PetResult;
