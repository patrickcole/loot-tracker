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
    <main className="page">
      <div className="collection__header">
        <h1 className="collection__title">{place.title}</h1>
        <Link to={`/edit/location/${place.slug}`}>Edit</Link>
      </div>
      <ul className="list list__fields">
        <li className="list-item__field">
          {place.coordinates}
        </li>
      </ul>
    </main>
  )
}

export default Location;
