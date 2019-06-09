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

function Item({ location, add }) {

  // Strip out the path info
  // TODO: Clean this up
  let page_slug = location.pathname;
  page_slug = page_slug.replace('/item/', '');

  let default_item = { slug: "", title: "", type: { category: "", system: "" }, locations: [] }
  let [item, setItem] = useState(default_item);
  let [update, setUpdate] = useState(true);
  let [message, setMessage] = useState('');

  useEffect(
    () => {
      if ( !add && update ) {
        getDataAsync(`/api/item/${page_slug}`).then( (response) => {
          setItem(response.data);
          setUpdate(false);
        })
      }
    }, [update, page_slug, add]
  );
  
  let onItemPropertyUpdate = e => {

    let currentObject = item;
    currentObject[e.currentTarget.dataset.field] = e.currentTarget.value;
    setItem(currentObject);
  };

  let onItemSubmit = e => {

    let command, routePath;
    if ( add ) {
      command = 'POST';
      routePath = `/api/items`;
    } else {
      command = 'PUT';
      routePath = `/api/item/${item.slug}`;
    }

    let request = {
      method: command,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    };

    sendDataAsync(routePath, request)
      .then( (response) => {
        setMessage(response.message)
      });
  }

  let renderEditor = () => {
    if ( !add ) {
      return (
        <>
        <button onClick={onItemSubmit}>Edit</button>
        <div style={{float: 'right'}}>
          <h3>Listings</h3>
          <Listings update={setUpdate} slug={item.slug} data={item.locations} />
          <ListingAdd update={setUpdate} slug={ item.slug } />
        </div>
        </>
      )
    } else {
      return <button onClick={onItemSubmit}>Add</button>
    }
  }

  return (
    <main>
      <p>{ message }</p>
      <p>{ item.slug }</p>
      <EditableText field="title" value={item.title} onUpdate={onItemPropertyUpdate} />
      { renderEditor() }
    </main>
  );
}

function EditableText( {field, value, onUpdate} ) {
  return (
    <p>
      <label>
        {field}: <input type="text" data-field={field} onChange={onUpdate} defaultValue={value} />
      </label>
    </p>
  )
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
      <p><Link to="/add/item">Add Item</Link></p>
    </main>
  )
}

function App() {

  return (
    <Router>
      <h1><Link to="/">Loot Tracker</Link></h1>
      <hr />
      <Route path="/" exact render={ props => <Main { ...props } /> } />
      <Route path="/add/item" exact render={ props => <Item {...props} add={true} /> } />
      <Route path="/item/:slug" exact render={ props => <Item {...props} add={false} /> } />
      <Route path="/location/:slug" exact render={ props => <Location {...props} /> } />
    </Router>
  );
}

export default App;
