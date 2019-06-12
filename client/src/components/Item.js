import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {asyncFetch, getRouteName} from '../utils/Network';

import { Image, CloudinaryContext } from 'cloudinary-react';

import Listings from './Listings';

function Item({ location }) {

  let routeName = getRouteName(location.pathname);
  let default_item = { slug: "", title: "", products: [] }
  let [item, setItem] = useState(default_item);

  useEffect(() => {
    asyncFetch(`/api/item/${routeName}`)
      .then( (response) => {
        
        // TODO: Make a utility function:
        let itemData = response.data[0];
          if ( itemData.products ){
            
            let newListings = itemData.products;
            newListings = newListings.sort( (a,b) => {
              return a.price.$numberDecimal - b.price.$numberDecimal;
            });

            itemData = {...itemData, products: newListings} 
          }

        setItem(itemData);
      });
    }, [routeName]
  );

  let renderImage = () => {
    if ( item.slug !== "" ) {
      return (
        <CloudinaryContext className="entity__cover" cloudName="dc0f4a05j">
          <Image className="cloudinary__image" publicId={`loot-tracker/${item.slug}`} />
        </CloudinaryContext>
      )
    }
  }
  

  return (
    <main className="page">
      <div className="entity">
        { renderImage() }
      </div>
      <div className="collection__header">
        <h1 className="collection__title">{item.title}</h1>
        <Link to={`/edit/item/${item.slug}`}>Edit</Link>
      </div>
      <ul className="list list__fields">
        <li className="list-item__field">
          { 
          <Listings slug={item.slug} data={item.products} edit={false} />
          }
        </li>
      </ul>
    </main>
  );
}

export default Item;
