import React from 'react';
import { BrowserRouter as Link } from 'react-router-dom';
import {asyncFetch} from '../utils/Network';
import ListingAdd from './ListingAdd';

function Listings({ slug, data, triggerEntityModification, edit }) {

  let onListingDelete = (e) => {

    let request = {
      method: 'DELETE',
      body: JSON.stringify({ _id: e.currentTarget.dataset.id })
    };

    asyncFetch(`/api/listing/${slug}`, request)
      .then( (response) => {
        if ( response.success ){
          triggerEntityModification(response.data);
        }
      });
  }

  let includeDeleteListing = (listing) => {
    if ( edit ) {
      return (<li><button onClick={onListingDelete} data-id={listing._id}>Delete</button></li>)
    }
  };

  let includeAddListing = () => {
    if ( edit ) {
      return <ListingAdd onComplete={triggerEntityModification} slug={ slug } />;
    }
  };

  return (
    <div>
      <h3>Listings</h3>
      <ul>
      {
        data.map( (entity, index) => {
          return (
            <li key={`listing${index}`}>
              <ul>
                <li>{ entity.date }</li>
                <li>{ entity.price.$numberDecimal }</li>
                <li><Link to={`/location/${entity.slug}`}>{ entity.slug }</Link></li>
                { includeDeleteListing(entity) }
              </ul>
              <hr />
            </li>
          )
        })
      }
      </ul>
      { includeAddListing() }
    </div>
  )
}

export default Listings;