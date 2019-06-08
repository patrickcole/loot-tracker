import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './App.css';

const getDataAsync = async function (url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

const sendDataAsync = async function (url, json) {
  let response = await fetch(url, json);
  let data = await response.json();
  return data;
}

function ItemsList( { data } ) {

  return (
    <ul>
      {
        data.map( item => {
          return (
            <li><Link to={`/item/${item.slug}`}>{ item.title }</Link></li>
          )
        })
      }
    </ul>
  )
};

function Listings({ update, slug, data }) {

  let onListingDelete = (e) => {

    let request = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ _id: e.currentTarget.dataset.id })
    };

    sendDataAsync(`/api/listing/${slug}`, request)
      .then( (response) => {
        if ( response.success ){
          update(true);
        }
      });
  }

  return (
    <ul>
    { data.map((listing, index) => {
      return <li key={`listing${index}`}>{ listing.price.$numberDecimal } - <Link to={`/location/${listing.slug}`}>{ listing.slug }</Link> at { listing.date } - <button onClick={onListingDelete} data-slug={listing.slug} data-id={listing._id}>Delete</button></li>
    })}
    </ul>
  )
}

function ListingAdd( { update, slug } ) {

  const DEFAULT_LISTING = { slug: '', title: "Location", price: '0.00' };
  const [listing, setListing] = useState(DEFAULT_LISTING);

  let onPriceUpdate = e => setListing({...listing, price: e.currentTarget.value});
  let onSlugUpdate = (locationSlug, locationTitle) => setListing({...listing, slug: locationSlug, title: locationTitle });

  let handleAddListing = (e) => {

    let request = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ slug: listing.slug, price: listing.price })
    };

    sendDataAsync(`/api/listing/${slug}`, request)
      .then( (response) => {
        if ( response.success ){
          update(true);
        }
      });

    setListing(DEFAULT_LISTING);
  };

  return (
    <aside>
      Price $<input type="text" placeholder="price" onChange={onPriceUpdate} value={listing.price} /> at <span>{ listing.title }</span>
      <p>
        <button onClick={handleAddListing} disabled={ listing.slug === '' ? true : false }>Add Listing</button>
      </p>

      <hr />
      <LocationSearch updateSlug={onSlugUpdate} />
    </aside>
  )
}

function LocationSearch({ updateSlug } ){

  const [query, setQuery] = useState('');
  const [locations, setLocations] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(
    () => {
      getDataAsync(`/api/locations`).then( (response) => {
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
  let handleChange = e => setQuery(e.currentTarget.value);
  let onResultClick = (e) => {
    
    updateSlug(e.currentTarget.dataset.slug, e.currentTarget.dataset.title);
    setResults([]);
    setQuery('');
  }

  return (
    <div>
      <h3>Search for Location</h3>
      <input type="text" placeholder="location" onKeyUp={handleSearch} onChange={handleChange} value={query} />
      <ul>
        {
          results.map( (result, index) => {
            return <li key={`result${index}`}><button onClick={onResultClick} data-slug={result.slug} data-title={result.title}>{ result.title }</button></li>
          })
        }
      </ul>
    </div>
  )
}

function Item({ location }) {

  let default_item = { title: "", type: { category: "", system: "" }, locations: [] }

  let [item, setItem] = useState(default_item);
  let [update, setUpdate] = useState(true);

  useEffect(
    () => {
      if ( update ) {
        let slug = location.pathname;
        slug = slug.replace('/item/','');
        getDataAsync(`/api/item/${slug}`).then( (response) => {
          setItem(response.data);
          setUpdate(false);
        })
      }
    }, [update, location]
  );
  

  return (
    <main>
      <h3>{ item.title }</h3>
      <p>{ item.type.category }</p>
      <p>{ item.type.system }</p>
      <Listings update={setUpdate} slug={item.slug} data={item.locations} />
      <ListingAdd update={setUpdate} slug={ item.slug } />
    </main>
  );
}

function Location( { location } ) {

  const [place, setPlace] = useState({ title: "", coordinates: "" });

  useEffect(
    () => {
      let slug = location.pathname;
      slug = slug.replace('/location/','');
      getDataAsync(`/api/location/${slug}`).then( (response) => {
        setPlace(response.data)
      })
    }, [ location ]
  );

  return (
    <main>
      <h3>{place.title}</h3>
      <p>{place.coordinates}</p>
    </main>
  )
}

function Main() {

  const [items, setItems] = useState([]);

  useEffect(
    () => {
      getDataAsync(`/api/items`).then( response => setItems(response.data) );
    }, []
  );

  return (
    <main>
      <h2>Items</h2>
      <ItemsList data={items} />
    </main>
  )
}

function App() {

  return (
    <Router>
      <h1>Loot Tracker</h1>
      <hr />
      <Route path="/" exact render={ props => <Main { ...props } /> } />
      <Route path="/item/:slug" exact render={ props => <Item {...props} /> } />
      <Route path="/location/:slug" exact render={ props => <Location {...props} /> } />
    </Router>
  );
}

export default App;
