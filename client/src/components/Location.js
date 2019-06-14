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
      <ul className="list list__fields">
        <li className="list-item__field">
          <span className="control__label">Listings</span>
          <div className="control__cell">
            <ul className="list list__listings">
            { 
              place.products.map( (product, index) => {
                return (
                  <li className="list-item list-item__listing" key={`item${index}`}><Link to={`/item/${product.item}`}><span className="price">${product.price.$numberDecimal}</span>{product.title}</Link></li>
                )
              })
            }
            </ul>
          </div>
        </li>
      </ul>
    </main>
  )
}

export default Location;
