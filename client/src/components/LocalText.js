import React from 'react';
import i18n from '../utils/i18n';

function LocalText( { term } ) {

  let labels = i18n('en').values;
  return (
    <>{labels[term]}</>
  )
}

export default LocalText;
