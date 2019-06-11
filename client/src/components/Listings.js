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
      return (<button className="btn" onClick={onListingDelete} data-id={listing._id}>Delete</button>)
    }
  };

  let includeAddListing = () => {
    if ( edit ) {
      return <ListingAdd onComplete={triggerEntityModification} slug={ slug } />;
    }
  };

  return (
    <div>
      <h3 className="title">Listings</h3>
      <ul className="list list__listings">
      {
        data.map( (entity, index) => {
          return (
            <li className="list-item list-item__listing" key={`listing${index}`}>
              ${ entity.price.$numberDecimal } &bull; <Link to={`/location/${entity.slug}`}>{ entity.slug }</Link> - { new Date(entity.date).toDateString() }
                { includeDeleteListing(entity) }
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