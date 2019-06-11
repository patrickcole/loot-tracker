import React, {useEffect, useState} from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';
import { asyncFetch } from '../utils/Network';
import EditableText from './EditableText';
import Listings from './Listings';

function EntityEditor( { location } ) {

  let locationValues = location.pathname.split('/');
  let route = { api: `/api/${locationValues[2]}/${locationValues[3]}`, mode: locationValues[1], entity: locationValues[2], slug: locationValues[3] }
  const [editor] = useState(route);

  const [entity, setEntity] = useState({});
  const [ready, setReady] = useState(false);
  const [update, setUpdate] = useState(false);
  const [message, setMessage] = useState('');


  const [dictionary, setDictionary] = useState({
    title: "Title",
    listings: "Listings",
    coordinates: "Coordinates"
  });

  let configureEntity = (data) => {
    // TODO: Make a utility function:
    if ( data.listings ){

      let newListings = data.listings;
      newListings = newListings.sort( (a,b) => {
        return a.price.$numberDecimal - b.price.$numberDecimal;
      });

      data = {...data, listings: newListings};
    }
    setEntity(data);
  }

  useEffect(() => {
    asyncFetch(editor.api)
      .then( (response) => {
        configureEntity(response.data);
        setReady(true);
      });
    }, [editor.api]
  );

  /*
  useEffect(() => {
      if ( update ){
        asyncFetch(editor.api)
        .then( (response) => {
          configureEntity(response.data);
          setUpdate(false);
        })
      }
    }, [editor.api, update]
  );
  */

  let onEntityModification = (data) => setEntity(data);
  let updateIsReady = (bool) => setUpdate(bool);
  let onEntityPropertyUpdate = e => setEntity({...entity, [e.currentTarget.dataset.field]: e.currentTarget.value});
  let onEntitySave = e => {
    
    let request = { method: 'PUT', body: JSON.stringify(entity) };
    asyncFetch(editor.api, request)
      .then( (response ) => {
        setMessage(response.message);
      });
  }
  let displayMessage = () => {
    if ( message !== "" ) {
      return <p>{message}</p>
    }
  }

  let renderField = (entity, property) => {
    switch ( property ) {
      case "_id": return null;
      case "slug": return null;
      case "__v": return null;
      case "listings":
        return (
          <li className="list-item__field">
            <Listings slug={entity.slug} data={entity.listings} updateIsReady={updateIsReady} triggerEntityModification={onEntityModification} edit={true} />
          </li>
        );
      default:
        return (

          <li key={`field${property}`} className="list-item__field">
            <EditableText field={property} label={dictionary[property]} value={entity[property]} onUpdate={onEntityPropertyUpdate} />
          </li>
        )
    }
  }
  let renderEntityLogic = () => {
    if ( ready ){

      let render = [];
      for ( let prop in entity ){
        
        let renderObj = renderField(entity, prop);
        if ( renderObj ){
          render.push( renderObj )
        }
      }

      return render;
    }
  }

  return (

    <main className="page">

      {displayMessage()}
      
      <h1 className="title"><Link to={`/${editor.entity}/${entity.slug}`}>{entity.title}</Link></h1>
      <ul className="list list__fields">
        { renderEntityLogic() }
      </ul>
      <button className="btn" onClick={onEntitySave}>Save</button>
    </main>
  )
}

export default EntityEditor;
