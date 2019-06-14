import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import {asyncFetch} from './utils/Network';

import EntityAdd from './components/EntityAdd';
import EntityEditor from './components/EntityEditor';

import Item from './components/Item';
import Location from './components/Location';
import LocalText from './components/LocalText';

import './App.css';

const cloudinary = require('cloudinary-core').Cloudinary.new({
  cloud_name: 'dc0f4a05j',
  api_key: '687833166592887',
  api_secret: 'RgYa8r5_XMxOURBOaT__Uz_skR8'
});

function EntityList( { collection, entity } ) {

  const [entities, setEntities] = useState([{}]);

  useEffect(
    () => {
      asyncFetch(`/api/${collection}`)
        .then( response => setEntities(response.data) );
    }, [collection]
  );

  let hasImageToRender = (item) => {

    if ( item && entity === 'item' ){

      let backgroundStyles = {
        backgroundImage: 'url(' + cloudinary.url('loot-tracker/' + item.slug) + ')'
      };

      return (
        <>
        <span className="entity__cover">
          <img src={cloudinary.url(`loot-tracker/${item.slug}`)} alt={`${item.slug}`} />
        </span>
        <span className="entity__blur" style={backgroundStyles}></span>
        </>
      )
    }
  }

  return (
    <div className="collection">
      <div className="collection__header">
        <h2 className="collection__title"><LocalText term={collection} /></h2>
      </div>
      
      <ul className="list list__collection">
        {
          entities.map( (item, index) => {

            return (
              <li className={`item item__${collection}`} key={`${item}-${index}`}>
                <Link className="entity" to={`/${entity}/${item.slug}`}>
                  { hasImageToRender(item) }
                  <span className="entity__subtitle">{ item.title }</span>
                </Link>
              </li>
            )
          })
        }
      </ul>
      
    </div>
  )
};

function Main() {

  return (
    <main className="page">
      <EntityList collection="items" entity="item" />
      <EntityList collection="locations" entity="location" />
    </main>
  )
}

function App() {

  return (
    <Router>
      <header className="masthead">
        <Link className="masthead__item masthead__brand" to="/">Loot Tracker</Link>
        <Link className="masthead__item" to={`/add/item`}>+ Item</Link>
        <Link className="masthead__item" to={`/add/location`}>+ Location</Link>
      </header>

      <Route path="/" exact render={ props => <Main { ...props } /> } />
      
      <Route path="/add/:entity/" exact render={ props => <EntityAdd {...props} /> } />
      <Route path="/edit/:entity/:slug" exact render={ props => <EntityEditor {...props} /> } />
      
      <Route path="/item/:slug" exact render={ props => <Item {...props} /> } />
      <Route path="/location/:slug" exact render={ props => <Location {...props} /> } />
    </Router>
  );
}

export default App;
