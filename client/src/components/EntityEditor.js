import React, {useEffect, useState} from 'react';
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

  useEffect(() => {
    asyncFetch(editor.api)
      .then( (response) => {
        setEntity(response.data);
        setReady(true);
      });
    }, [editor.api]
  );

  useEffect(() => {
      if ( update ){
        asyncFetch(editor.api)
        .then( (response) => {
          setEntity( response.data );
          setUpdate(false);
        })
      }
    }, [editor.api, update]
  );

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
  let renderEntityLogic = () => {
    if ( ready ){
      if ( editor.entity === 'item' ){
        return (
          <Listings slug={entity.slug} data={entity.listings} updateIsReady={updateIsReady} edit={true} />
        )
      }
    }
  }

  return (
    <main>
      <h1>EntityEditor</h1>
      {displayMessage()}
      <pre>{entity.slug}</pre>
      <EditableText field="title" value={entity.title} onUpdate={onEntityPropertyUpdate} />
      { renderEntityLogic() }
      <button onClick={onEntitySave}>Save</button>
    </main>
  )
}

export default EntityEditor;
