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
    updateListingLocation(e.currentTarget.dataset.slug, title);
  };

  return (
    <>
      <input type="text" placeholder="location" onKeyUp={handleSearch} onChange={handleSearch} value={query} />
      <ul>
        {
          results.map( (result, index) => {
            return <li key={`result${index}`}>{ result.title } - <button data-slug={result.slug} data-title={result.title} onClick={onResultApply}>Select</button></li>
          })
        }
      </ul>
    </>
  )
}

function ListingAdd( { onComplete, slug } ) {

  const DEFAULT_LISTING = { slug: '', title: '', price: '' };
  const [listing, setListing] = useState(DEFAULT_LISTING);

  let onPriceUpdate = e => setListing({...listing, price: e.currentTarget.value});
  let onSlugUpdate = (locationSlug, locationTitle) => setListing({...listing, slug: locationSlug, title: locationTitle });

  let handleAddListing = (e) => {

    let request = {
      method: 'POST',
      body: JSON.stringify({ slug: listing.slug, price: listing.price })
    };

    asyncFetch(`/api/listing/${slug}`, request)
      .then( (response) => {
        if ( response.success ){
          onComplete(response.data);
          setListing(DEFAULT_LISTING);
        }
      });
  };

  return (
    <aside>
      <h3>Add Listing</h3>
      <p>
        <label>Price
          $<input type="text" placeholder="price" onChange={onPriceUpdate} value={listing.price} />
        </label>
        at
        <LocationSearch updateListingLocation={onSlugUpdate} />
      </p>
      <p>
        <button onClick={handleAddListing} disabled={ listing.slug === '' ? true : false }>Add Listing</button>
      </p>
    </aside>
  )
}

export default ListingAdd;
