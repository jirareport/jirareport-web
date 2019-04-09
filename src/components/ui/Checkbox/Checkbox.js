import React from "react";

export default ({ label, name, value, onChange }) =>
    <p>
        <label>
            <input type="checkbox"
                   name={name}
                   checked={value || false}
                   onChange={onChange}/>
            <span>{label}</span>
        </label>
    </p>;
