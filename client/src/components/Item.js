import React, { useEffect, useState } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';
import {asyncFetch, getRouteName} from '../utils/Network';

import { Image, CloudinaryContext } from 'cloudinary-react';

import Listings from './Listings';

function Item({ location }) {

  let routeName = getRouteName(location.pathname);
  let default_item = { slug: "", title: "", listings: [] }
  let [item, setItem] = useState(default_item);

  useEffect(() => {
    asyncFetch(`/api/item/${routeName}`)
      .then( (response) => {
        
        // TODO: Make a utility function:
        let itemData = response.data;
        let newListings = itemData.listings;
        newListings = newListings.sort( (a,b) => {
          return a.price.$numberDecimal - b.price.$numberDecimal;
        });

        setItem({...itemData, listings: newListings});
      });
    }, [routeName]
  );

  

  return (
    <main className="page">
      <div className="entity">
        <CloudinaryContext className="entity__cover" cloudName="dc0f4a05j">
          <Image className="cloudinary__image" publicId={`loot-tracker/${item.slug}`} />
        </CloudinaryContext>
      </div>
      <div className="collection__header">
        <h1 className="collection__title">{item.title}</h1>
        <Link to={`/edit/item/${item.slug}`}>Edit</Link>
      </div>
      <Listings slug={item.slug} data={item.listings} edit={false} />
    </main>
  );
}

export default Item;
