import React, {useEffect, useState} from 'react';
import { asyncFetch } from '../utils/Network';
import Listings from './Listings';

function EntityEditor( { location } ) {

  let locationValues = location.pathname.split('/');
  let route = { api: `/api/${locationValues[2]}/${locationValues[3]}`, mode: locationValues[1], entity: locationValues[2], slug: locationValues[3] }
  const [editor] = useState(route);

  const [entity, setEntity] = useState({});
  const [ready, setReady] = useState(false);
  const [update, setUpdate] = useState(false);

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

  let renderEntityLogic = () => {
    if ( ready ){
      if ( editor.entity === 'item' ){
        return (
          <Listings slug={entity.slug} data={entity.locations} updateIsReady={updateIsReady} edit={true} />
        )
      }
    }
  }

  return (
    <main>
      <h1>EntityEditor</h1>
      <p>{ entity.slug }</p>
      <p>{ entity.title }</p>
      { renderEntityLogic() }
    </main>
  )
}

export default EntityEditor;
