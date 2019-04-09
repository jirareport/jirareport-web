import React from "react";

import { Col, DatePicker, InputField } from "components/ui";

export default ({ holiday, changeValue, errors }) => <>
    <InputField s={12}
                name="description"
                label="Descrição"
                onChange={e => changeValue("description", e.target.value)}
                value={holiday.description}
                errors={errors["description"]}/>

    <Col s={12}>
        <DatePicker name="date"
                    value={holiday.date}
                    changeValue={changeValue}
                    label="Data"
                    errors={errors["date"]}/>
    </Col>
</>;
