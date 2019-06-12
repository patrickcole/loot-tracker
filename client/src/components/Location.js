import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { asyncFetch, getRouteName } from '../utils/Network';

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

    <Map center={place.latlng.coordinates} zoom={15} width={480} height={320}>
      <Marker anchor={place.latlng.coordinates} payload={1} onClick={({ event, anchor, payload }) => {}} />
    </Map>
  );

  return (
    <main className="page">
      {map}
      <div className="collection__header">
        <h1 className="collection__title">{place.title}</h1>
        <Link to={`/edit/location/${place.slug}`}>Edit</Link>
      </div>
      <ul>
      { 
        place.products.map( (product, index) => {
          return (
            <li key={`item${index}`}><Link to={`/item/${product.item}`}>{product.title} - ${product.price.$numberDecimal}</Link></li>
          )
        })
      }
      </ul>
    </main>
  )
}

export default Location;
