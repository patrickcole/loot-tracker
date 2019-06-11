import React, { useEffect, useState } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';
import {asyncFetch, getRouteName} from '../utils/Network';

import Listings from './Listings';

function Item({ location }) {

  let routeName = getRouteName(location.pathname);
  let default_item = { slug: "", title: "", listings: [] }
  let [item, setItem] = useState(default_item);

  useEffect(() => {
    asyncFetch(`/api/item/${routeName}`)
      .then( (response) => setItem(response.data));
    }, [routeName]
  );

  return (
    <main>
      <h3>{ item.title }</h3>
      <Link to={`/edit/item/${item.slug}`}>Edit</Link>
      <Listings slug={item.slug} data={item.listings} edit={false} />
    </main>
  );
}

export default Item;
