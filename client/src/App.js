import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import './App.css';

const getDataAsync = async function (url) {
  let response = await fetch(url);
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

function LocationsList( { data } ) {

  return (
    <ul>
      {
        data.map( item => {
          return (
            <li>
              { item.title }
            </li>
          )
        })
      }
    </ul>
  )
}

function Listings({ data }) {
  return (
    <ul>
    { data.map((listing) => {
      return <li>{ listing.price } - <Link to={`/location/${listing.slug}`}>{ listing.slug }</Link> at { listing.date }</li>
    })}
    </ul>
  )
}

function Item({ location }) {

  let default_item = { title: "", type: { category: "", system: "" }, locations: [] }

  let [item, setItem] = useState(default_item);

  useEffect(
    () => {
      let slug = location.pathname;
      slug = slug.replace('/item/','');
      getDataAsync(`/api/item/${slug}`).then( (response) => {
        setItem(response.data)
      })
    }, [ location ]
  );
  

  return (
    <main>
      <h3>{ item.title }</h3>
      <p>{ item.type.category }</p>
      <p>{ item.type.system }</p>
      <Listings data={item.locations} />
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
