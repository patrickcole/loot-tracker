import React from 'react';

function EditableText( {field, label, value, onUpdate} ) {
  return (
    <>
      <label className="control__label" for={`control_${field}`}>{label}</label>
      <input className="control__input" id={`control_${field}`} type="text" data-field={field} onChange={onUpdate} defaultValue={value} />
    </>
  )
}

export default EditableText;
