import React, { useEffect, useState } from 'react';
import { asyncFetch, getRouteName } from '../utils/Network';

function Location( { location } ) {

  let routeName = getRouteName(location.pathname);
  const [place, setPlace] = useState({ title: "", coordinates: "" });

  useEffect(
    () => {
      asyncFetch(`/api/location/${routeName}`)
        .then( (response) => setPlace(response.data));
    }, [ routeName ]
  );

  return (
    <main>
      <h3>{place.title}</h3>
      <p>{place.coordinates}</p>
    </main>
  )
}

export default Location;
