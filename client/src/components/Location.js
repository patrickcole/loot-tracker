import React, { useEffect, useState } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';
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
      <h1>{place.title}</h1>
      <Link to={`/edit/location/${place.slug}`}>Edit</Link>
      <p>{place.coordinates}</p>
    </main>
  )
}

export default Location;
