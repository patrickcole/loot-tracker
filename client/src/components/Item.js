import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {asyncFetch, getRouteName} from '../utils/Network';

import Listings from './Listings';

const cloudinary = require('cloudinary-core').Cloudinary.new({
  cloud_name: 'dc0f4a05j',
  api_key: '294845966527839',
  api_secret: 'ygoXvZ6-RWbwyNq1mOuYVhRxrY0'
});

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
      let backgroundStyles = {
        backgroundImage: 'url(' + cloudinary.url('loot-tracker/' + item.slug) + ')'
      };

      return (
        <>
        <span className="entity__cover">
          <img src={cloudinary.url(`loot-tracker/${item.slug}`)} alt={`${item.slug}`} />
        </span>
        <span className="entity__blur" style={backgroundStyles}></span>
        </>
      )
    }
  }
  

  return (
    <main className="page page__collection">
      <div className="collection__item">
        <div className="item">
          <div className="entity">
            { renderImage() }
          </div>
        </div>
        <Link className="btn btn__edit" to={`/edit/item/${item.slug}`}>Edit</Link>
      </div>
      <div className="collection__content">
        <div className="collection__header">
          <h1 className="collection__title">{item.title}</h1>
        </div>
        <ul className="list list__fields">
          <li className="list-item__field">
            { 
            <Listings slug={item.slug} data={item.products} edit={false} />
            }
          </li>
        </ul>
      </div>
    </main>
  );
}

export default Item;
