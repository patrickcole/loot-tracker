import React, {useState} from 'react';
import { asyncFetch, getRouteName } from '../utils/Network';
import EditableText from './EditableText';
import LocalText from './LocalText';

function EntityAdd( { location } ) {

  let schemas = {
    item:
      {
        formatted: "item",
        fields: {
          slug: "slug",
          title: "title"
        }
      },
    location:
      {
        formatted: "location",
        fields: {
          slug: "slug",
          title: "title",
          editorCoordinates: "editorCoordinates"
        }
      }
  };
  
  let apiEntity = location.pathname;
  apiEntity = apiEntity.replace('/add/','/api/');

  let routeName = getRouteName(location.pathname);

  const [entity, setEntity] = useState({ slug: '', title: '', latlng: { type: "Point", coordinates: [] }, editorCoordinates: '' });
  const [message, setMessage] = useState('');

  let onEntityPropertyUpdate = e => setEntity({...entity, [e.currentTarget.dataset.field]: e.currentTarget.value});

  let onEntityAdd = e => {

    // TODO: Make a utility function:
    // if a location:
    if ( routeName === 'location' ){
      let coorRawValues = entity.editorCoordinates;
      coorRawValues = coorRawValues.split(',');
      let latLngCoors = coorRawValues.map( value => parseFloat(value) );

      let newEntity = entity;
      newEntity.latlng.coordinates = latLngCoors;
      setEntity(newEntity);
    }
    
    let request = { method: 'POST', body: JSON.stringify(entity) };
    asyncFetch(`${apiEntity}s`, request)
      .then( (response ) => {
        setMessage(response.message);
      });
  }

  let displayMessage = () => {
    if ( message !== "" ) {
      return <p>{message}</p>
    }
  }

  let renderEntityFields = ( schema ) => {

    let render = [];
    for ( let prop in schema ) {
      render.push(<li key={`field_${prop}`} className="list-item__field"><EditableText field={prop} label={schema[prop]} value={entity[prop]} onUpdate={onEntityPropertyUpdate} /></li>)
    }

    return render;
  }

  return (
    <main className="page">
      <h1><LocalText term={schemas[routeName].formatted} /></h1>
      {displayMessage()}
      <ul className="list list__fields">
        { renderEntityFields( schemas[routeName].fields ) }
      </ul>
      <button className="btn" onClick={onEntityAdd}>Add</button>
    </main>
  )
}

export default EntityAdd;
