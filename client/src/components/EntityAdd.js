import React, {useState} from 'react';
import { asyncFetch } from '../utils/Network';
import EditableText from './EditableText';

function EntityAdd( { location } ) {

  let apiEntity = location.pathname;
  apiEntity = apiEntity.replace('/add/','/api/');

  const [entity, setEntity] = useState({ slug: '', title: '', listings: [] });
  const [message, setMessage] = useState('');

  let onEntityPropertyUpdate = e => setEntity({...entity, [e.currentTarget.dataset.field]: e.currentTarget.value});
  let onEntityAdd = e => {
    
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

  return (
    <main className="page">
      <h1>EntityAdd</h1>
      {displayMessage()}
      <div className="widget">
        <EditableText field="slug" value={entity.slug} onUpdate={onEntityPropertyUpdate} />
        <EditableText field="title" value={entity.title} onUpdate={onEntityPropertyUpdate} />
        <button className="btn" onClick={onEntityAdd}>Add</button>
      </div>
    </main>
  )
}

export default EntityAdd;
