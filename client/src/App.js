import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Image, CloudinaryContext } from 'cloudinary-react';

import {asyncFetch} from './utils/Network';

import EntityAdd from './components/EntityAdd';
import EntityEditor from './components/EntityEditor';

import Item from './components/Item';
import Location from './components/Location';

import './App.css';

function EntityList( { collection, entity, title } ) {

  const [entities, setEntities] = useState([{}]);

  useEffect(
    () => {
      asyncFetch(`/api/${collection}`)
        .then( response => setEntities(response.data) );
    }, [collection]
  );

  let hasImageToRender = (item) => {

    if ( item && entity === 'item' ){
      return (
        <CloudinaryContext className="entity__cover" cloudName="dc0f4a05j">
          <Image publicId={`loot-tracker/${item.slug}`} />
        </CloudinaryContext>
      )
    }
  }

  return (
    <div className="collection">
      <div className="collection__header">
        <h2 className="collection__title">{title}s</h2>
        <Link to={`/add/${entity}`}>Add {title}</Link>
      </div>
      
      <ul className="list list__collection">
        {
          entities.map( (item, index) => {
            return (
              <li className="entity" key={`${item}-${index}`}>
                <Link to={`/${entity}/${item.slug}`}>
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
      <EntityList collection="items" entity="item" title="Item" />
      <EntityList collection="locations" entity="location" title="Location" />
    </main>
  )
}

function App() {

  return (
    <Router>
      <header className="masthead">
        <Link to="/">Loot Tracker</Link>
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
