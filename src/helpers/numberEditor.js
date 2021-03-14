import React, { useState } from "react";

const NumberEditor = ({ value, disabled = false, onChange, ...rest }) => {
  let [v, setV] = useState(value);

  function autoFocusAndSelect(input) {
    input?.focus();
  }

  return (
    <input
      disabled={disabled}
      type="number"
      ref={autoFocusAndSelect}
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={(e) => onChange(parseInt(e.target.value))}
    />
  );
};

export default NumberEditor;
