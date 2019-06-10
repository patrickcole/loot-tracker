import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import {asyncFetch, getRouteName} from './utils/Network';

import EntityEditor from './components/EntityEditor';
import Listings from './components/Listings';
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

function Item({ location }) {

  let routeName = getRouteName(location.pathname);
  let default_item = { slug: "", title: "", type: { category: "", system: "" }, locations: [] }
  let [item, setItem] = useState(default_item);
  //let [update, setUpdate] = useState(true);
  //let [message, setMessage] = useState('');

  useEffect(() => {
    asyncFetch(`/api/item/${routeName}`)
      .then( (response) => {
          setItem(response.data);
          //setUpdate(false);
        });
    }, [routeName]
  );
  
  /*
  let onItemPropertyUpdate = e => setItem({...item, [e.currentTarget.dataset.field]: e.currentTarget.value});
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
      body: JSON.stringify(item)
    };

    asyncFetch(routePath, request)
      .then( (response) => {
        setMessage(response.message)
      });
  }

  let renderEditor = () => {
    if ( !add ) {
      return (
        <button onClick={onItemSubmit}>Edit</button>
      )
    } else {
      return (
        <>
        <EditableText field="slug" value={item.slug} onUpdate={onItemPropertyUpdate} />
        <button onClick={onItemSubmit}>Add</button>
        </>
      )
    }
  }
  */

  return (
    <main>
      <h3>{ item.title }</h3><Link to={`/edit/item/${item.slug}`}>Edit</Link>
      <Listings slug={item.slug} data={item.locations} edit={false} />
    </main>
  );
}

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
      <h1><Link to="/">Loot Tracker</Link></h1>
      <hr />
      <Route path="/" exact render={ props => <Main { ...props } /> } />
      
      <Route path="/add/item" exact render={ props => <Item {...props} add={true} /> } />
      <Route path="/edit/:entity/:slug" exact render={ props => <EntityEditor {...props} /> } />
      
      <Route path="/item/:slug" exact render={ props => <Item {...props} /> } />
      <Route path="/location/:slug" exact render={ props => <Location {...props} /> } />
    </Router>
  );
}

export default App;
