import React, {useState, useEffect} from 'react';
import {asyncFetch} from '../utils/Network';

function LocationSearch({ updateListingLocation } ){

  const [query, setQuery] = useState('');
  const [locations, setLocations] = useState([]);
  const [results, setResults] = useState([]);

  // get locations up-front
  // TODO: Maybe pull this from a cached location?
  useEffect(
    () => {
      asyncFetch(`/api/locations`)
        .then( (response) => {
          setLocations(response.data);
        })
    }, []
  );

  useEffect(
    () => {
      if ( query !== "" ){

        let newResults = locations.filter( (item) => {
          return item.title.toLowerCase().includes(query)
        });
        setResults(newResults);
      } else {
        setResults([]);
      }
      
    }, [query, locations]
  )
  let handleSearch = e => setQuery(e.currentTarget.value.toLowerCase());
  let onResultApply = e => {
    
    let title = e.currentTarget.dataset.title;
    setQuery(title);
    updateListingLocation(e.currentTarget.dataset.slug);
  };

  return (
    <div className="search__location">
      <input type="text" placeholder="location" onKeyUp={handleSearch} onChange={handleSearch} value={query} />
      <ul>
        {
          results.map( (result, index) => {
            return <li key={`result${index}`}>{ result.title } - <button className="btn" data-slug={result.slug} data-title={result.title} onClick={onResultApply}>Select</button></li>
          })
        }
      </ul>
    </div>
  )
}

function ListingAdd( { slug, onListingAdd } ) {

  const DEFAULT_LISTING = { item: slug, location: '', price: '' };
  const [listing, setListing] = useState(DEFAULT_LISTING);

  let onPriceUpdate = e => setListing({...listing, price: e.currentTarget.value});
  let onLocationUpdate = (locationSlug) => setListing({...listing, location: locationSlug });

  let handleAddListing = (e) => {

    let request = {
      method: 'POST',
      body: JSON.stringify(listing)
    };

    asyncFetch(`/api/listings`, request)
      .then( (response) => {
        if ( response.success ){
          onListingAdd();
          setListing(DEFAULT_LISTING);
        }
      });
  };

  return (
    <aside>
      <h4 className="title">Add Listing</h4>
      <div>
        <label>Price
          $<input type="text" placeholder="price" onChange={onPriceUpdate} value={listing.price} />
        </label>
        at
        <LocationSearch updateListingLocation={onLocationUpdate} />
        <button className="btn" onClick={handleAddListing} disabled={ listing.slug === '' ? true : false }>Add Listing</button>
      </div>
    </aside>
  )
}

export default ListingAdd;
