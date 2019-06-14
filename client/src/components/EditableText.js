import React from 'react';
import LocalText from './LocalText';

function EditableText( {field, label, value, onUpdate} ) {

  return (
    <>
      <label className="control__label" htmlFor={`control_${field}`}>
        <LocalText term={label} />
      </label>
      <span className="control__cell">
        <input className="control__input" id={`control_${field}`} type="text" data-field={field} onChange={onUpdate} defaultValue={value} />
      </span>
    </>
  )
}

export default EditableText;
