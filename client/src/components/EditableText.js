import React from 'react';

function EditableText( {field, value, onUpdate} ) {
  return (
    <p>
      <label>
        {field}: <input type="text" data-field={field} onChange={onUpdate} defaultValue={value} />
      </label>
    </p>
  )
}

export default EditableText;
