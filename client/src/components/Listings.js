import React from 'react';
import { Link } from 'react-router-dom';
import {asyncFetch} from '../utils/Network';
import ListingAdd from './ListingAdd';
import LocalText from './LocalText';

function Listings({ slug, data, edit, editorEntity, triggerDataUpdate }) {

  let onListingDelete = (e) => {

    let request = {
      method: 'DELETE',
      body: JSON.stringify({ _id: e.currentTarget.dataset.id })
    };

    asyncFetch(`/api/listings`, request)
      .then( (response) => {
        if ( response.success ){
          triggerDataUpdate();
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
      return <ListingAdd slug={ slug } onListingAdd={triggerDataUpdate} />;
    }
  };

  let renderListings = () => {
    if ( data.length > 0 ) {
      return (
        <ul className="list list__listings">
        {
          data.map( (entity, index) => {

            return (
              <li className="list-item list-item__listing" key={`listing${index}`}>
                <span className="price">${ entity.price.$numberDecimal }</span>
                <Link className="location" to={`/location/${entity.location}`}>{ entity.title }</Link>
                <span className="date">{ new Date(entity.date).toDateString() }</span>
                { includeDeleteListing(entity) }
              </li>
            )
          })
        }
        </ul>
      )
    } else {
      return <p>No listings available</p>
    }
  }

  return (
    <>
      <span className="control__label"><LocalText term="listings" /></span>
      <div className="control__cell">
        { renderListings() }
        { includeAddListing() }
      </div>
      
    </>
  )
}

export default Listings;