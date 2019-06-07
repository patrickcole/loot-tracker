import React, { useEffect, useState } from 'react';
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
          return <li>{ item.title }</li>
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

function App() {

  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(
    () => {
      getDataAsync(`/api/locations`).then( response => setLocations(response.data) );
      getDataAsync(`/api/items`).then( response => setItems(response.data) );
    }, []
  );

  return (
    <div className="App">
      <h1>Loot Tracker</h1>
      <hr />
      <h2>Items</h2>
      <ItemsList data={items} />
      <h2>Locations</h2>
      <LocationsList data={locations} />
    </div>
  );
}

export default App;
