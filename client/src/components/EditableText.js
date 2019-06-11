import React from 'react';

function EditableText( {field, label, value, onUpdate} ) {
  return (
    <>
      <label className="control__label" htmlFor={`control_${field}`}>{label}</label>
      <span className="control__cell">
        <input className="control__input" id={`control_${field}`} type="text" data-field={field} onChange={onUpdate} defaultValue={value} />
      </span>
    </>
  )
}

export default EditableText;
