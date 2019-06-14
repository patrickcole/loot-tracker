import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { asyncFetch, getRouteName } from '../utils/Network';

import Listings from './Listings';
import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';

function Location( { location } ) {

  let routeName = getRouteName(location.pathname);
  const [place, setPlace] = useState({ title: "", latlng: {coordinates:[0,0]}, products: [] });

  useEffect(
    () => {
      asyncFetch(`/api/location/${routeName}`)
        .then( (response) => {
          setPlace(response.data[0])
        });
    }, [ routeName ]
  );

  let map = (

    <Map boxClassname="map" center={place.latlng.coordinates} zoom={15} defaultWidth={400} height={320}>
      <Marker anchor={place.latlng.coordinates} payload={1} onClick={({ event, anchor, payload }) => {}} />
    </Map>
  );

  return (
    <main className="page page__collection">
      <div className="collection__location">
        <div className="map__container">
          {map}
        </div>
        <Link className="btn btn__edit" to={`/edit/location/${place.slug}`}>Edit</Link>
      </div>
      <div className="collection__content">
        <div className="collection__header">
          <h1 className="collection__title">{place.title}</h1>
        </div>
        <ul className="list list__fields">
          <li className="list-item__field">
            <Listings slug="" data={place.products} edit={false} />
          </li>
        </ul>
      </div>
    </main>
  )
}

export default Location;
