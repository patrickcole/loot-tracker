import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import {asyncFetch} from './utils/Network';

import EntityAdd from './components/EntityAdd';
import EntityEditor from './components/EntityEditor';

import Item from './components/Item';
import Location from './components/Location';

function EntityList( { collection, entity, title } ) {

  const [entities, setEntities] = useState([{}]);

  useEffect(
    () => {
      asyncFetch(`/api/${collection}`)
        .then( response => setEntities(response.data) );
    }, [collection]
  );

  return (
    <div>
      <h2>{title}s</h2>
      <ul>
        {
          entities.map( (item, index) => {
            return (
              <li key={`${item}-${index}`}><Link to={`/${entity}/${item.slug}`}>{ item.title }</Link></li>
            )
          })
        }
      </ul>
      <p><Link to={`/add/${entity}`}>Add {title}</Link></p>
      <hr />
    </div>
  )
};

function Main() {

  return (
    <main>
      <EntityList collection="items" entity="item" title="Item" />
      <EntityList collection="locations" entity="location" title="Location" />
    </main>
  )
}

function App() {

  return (
    <Router>
      <p><Link to="/">Loot Tracker</Link></p>
      <hr />
      <Route path="/" exact render={ props => <Main { ...props } /> } />
      
      <Route path="/add/:entity/" exact render={ props => <EntityAdd {...props} /> } />
      <Route path="/edit/:entity/:slug" exact render={ props => <EntityEditor {...props} /> } />
      
      <Route path="/item/:slug" exact render={ props => <Item {...props} /> } />
      <Route path="/location/:slug" exact render={ props => <Location {...props} /> } />
    </Router>
  );
}

export default App;
