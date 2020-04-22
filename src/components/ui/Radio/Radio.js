import React from 'react';

import { Col } from "components/ui";

import './Radio.scss';

const Radio = ({ name, value, options, onChange }) =>
    <Col s={12} className="radio__container">
        {options.map(option =>
            <label className="radio__item" key={option.name}>
                <input className="with-gap"
                       name={name}
                       type="radio"
                       value={option.value}
                       checked={option.value === value}
                       onChange={e => onChange(name, e.target.value)}/>
                <span className="radio__item__span">{option.name}</span>
            </label>
        )}
    </Col>;

export default Radio;
