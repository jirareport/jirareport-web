import React from "react";

import { Col, Input } from "components/ui";

const InputField = ({ name, onChange, value, label, help, errors, s, m, l, xl, ...others }) =>
    <Col className="input-field" s={s} m={m} l={l} xl={xl}>
        <Input name={name} onChange={onChange} value={value} label={label} errors={errors} help={help} {...others}/>
    </Col>;

export default InputField;
