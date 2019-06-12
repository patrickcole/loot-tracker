import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { asyncFetch, getRouteName } from '../utils/Network';

function Location( { location } ) {

  let routeName = getRouteName(location.pathname);
  const [place, setPlace] = useState({ title: "", coordinates: "", products: [] });

  useEffect(
    () => {
      asyncFetch(`/api/location/${routeName}`)
        .then( (response) => {
          setPlace(response.data[0])
        });
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
