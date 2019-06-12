import React, {useState} from 'react';
import { asyncFetch, getRouteName } from '../utils/Network';
import EditableText from './EditableText';

function EntityAdd( { location } ) {

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

  let displayLocationSpecific = () => {
    if ( routeName === "location" ){
      return (
        <li key={`field_latlng`} className="list-item__field"><EditableText field="editorCoordinates" label="coordinates" value={entity.editorCoordinates} onUpdate={onEntityPropertyUpdate} /></li>
      )
    }
  }

  return (
    <main className="page">
      <h1>{routeName}</h1>
      {displayMessage()}
      <ul className="list list__fields">
        <li key={`field_slug`} className="list-item__field"><EditableText field="slug" label="slug" value={entity.slug} onUpdate={onEntityPropertyUpdate} /></li>
        <li key={`field_title`} className="list-item__field"><EditableText field="title" label="title" value={entity.title} onUpdate={onEntityPropertyUpdate} /></li>
        { displayLocationSpecific() }
      </ul>
      <button className="btn" onClick={onEntityAdd}>Add</button>
    </main>
  )
}

export default EntityAdd;
