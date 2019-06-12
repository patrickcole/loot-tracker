import React from 'react';
import { Link } from 'react-router-dom';
import {asyncFetch} from '../utils/Network';
import ListingAdd from './ListingAdd';

function Listings({ slug, data, edit, editorEntity }) {

  let onListingDelete = (e) => {

    let request = {
      method: 'DELETE',
      body: JSON.stringify({ _id: e.currentTarget.dataset.id })
    };

    asyncFetch(`/api/listings`, request)
      .then( (response) => {
        if ( response.success ){
          console.log(response);
        }
      });
  }

  let includeDeleteListing = (listing) => {
    if ( edit ) {
      return (<button className="btn btn__control" onClick={onListingDelete} data-id={listing._id}>&times;</button>)
    }
  };

  let includeAddListing = () => {

    if ( edit && (editorEntity !== 'location') ) {
      return <ListingAdd slug={ slug } />;
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
                <span>${ entity.price.$numberDecimal } &bull; <Link to={`/location/${entity.location}`}>{ entity.title }</Link> - { new Date(entity.date).toDateString() }</span>
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