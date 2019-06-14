import React, {useState, useEffect} from 'react';
import {asyncFetch} from '../utils/Network';

function LocationSearch({ updateResults, clear } ){

  const [term, setTerm] = useState('');
  const [locations, setLocations] = useState([]);

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

  useEffect(() => {
    if ( clear ) {
      setTerm('');
    }
  }, [clear]
  );

  useEffect(
    () => {
      if ( term !== "" ){

        let newResults = locations.filter( (item) => {
          return item.title.toLowerCase().includes(term)
        });
        updateResults(newResults);
      } else {
        updateResults([]);
      }
      
    }, [term, locations, updateResults]
  )
  let handleSearch = e => setTerm(e.currentTarget.value.toLowerCase());
  

  return (
    <label className="listingAdd__search">
      <span className="listingAdd__hidden">Search Term</span>
      <input className="listingAdd__input" type="text" placeholder="Search Locations" onKeyUp={handleSearch} onChange={handleSearch} value={term} />
    </label>
  )
}

function ListingAdd( { slug, onListingAdd } ) {

  const DEFAULT_LISTING = { item: slug, location: '', price: '' };
  const [listing, setListing] = useState(DEFAULT_LISTING);
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState('');
  const [clearStatus, setClearStatus] = useState(false);
  
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
          setTitle('');
        }
      });
  };

  let onPriceUpdate = e => setListing({...listing, price: e.currentTarget.value});
  let onResultApply = e => {
    setTitle(e.currentTarget.dataset.title);
    setListing({...listing, location: e.currentTarget.dataset.slug});
    setClearStatus(true);
  };
  let onResultsUpdate = (data) => setResults(data);

  return (
    <aside className="listingAdd">
      <h4 className="title">Add Listing</h4>
      <div className="listingAdd__controls">
        <label className="listingAdd__price">Price:
          $<input className="listingAdd__input" type="text" placeholder="price" onChange={onPriceUpdate} value={listing.price} />
        </label>
        <span className="listingAdd__location">Location: { title }</span>
        <button className="btn" onClick={handleAddListing} disabled={ listing.slug === '' ? true : false }>Add Listing</button>
      </div>
      <LocationSearch updateResults={onResultsUpdate} clear={clearStatus} />
      <ul className="listingAdd__results">
        {
          results.map( (result, index) => {
            return (
              <li className="listingAdd__result" key={`result${index}`}>
                <span className="result__title">{ result.title }</span>
                <button className="btn" data-slug={result.slug} data-title={result.title} onClick={onResultApply}>Select</button>
              </li>
            )
          })
        }
      </ul>
    </aside>
  )
}

export default ListingAdd;
