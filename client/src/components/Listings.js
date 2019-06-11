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
      return (<button className="btn btn__control" onClick={onListingDelete} data-id={listing._id}>&times;</button>)
    }
  };

  let includeAddListing = () => {
    if ( edit ) {
      return <ListingAdd onComplete={triggerEntityModification} slug={ slug } />;
    }
  };

  return (
    <>
      <span className="control__label">Listings</span>
      <div className="control__cell">
        <ul className="list list__listings">
        {
          data.map( (entity, index) => {
            return (
              <li className="list-item list-item__listing" key={`listing${index}`}>
                <span>${ entity.price.$numberDecimal } &bull; <Link to={`/location/${entity.slug}`}>{ entity.slug }</Link> - { new Date(entity.date).toDateString() }</span>
                  { includeDeleteListing(entity) }
              </li>
            )
          })
        }
        </ul>
        { includeAddListing() }
      </div>
      
    </>
  )
}

export default Listings;