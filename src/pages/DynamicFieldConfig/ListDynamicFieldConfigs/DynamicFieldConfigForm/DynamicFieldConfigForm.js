import React from "react";

import { Button, Col, InputField, Panel, Row, Select } from "components/ui";

export default ({ dynamicFieldConfig, customFields, errors, loading, changeValue, handleSubmit }) => {
    return <Panel title="Novo campo dinâmico" loading={loading} actions={
        <Button type="submit" onClick={handleSubmit}>
            Inserir
        </Button>
    }>
        <Row>
            <InputField s={12} l={6}
                        name="name"
                        onChange={e => changeValue("name", e.target.value)}
                        value={dynamicFieldConfig.name}
                        errors={errors["name"]}
                        label="Nome"/>

            <Col s={12} l={6}>
                <Select withoutWrapper
                        options={customFields}
                        label="Campo"
                        onChange={selected => changeValue("field", (selected || {}).value)}
                        value={dynamicFieldConfig.field}
                        errors={errors["field"]}/>
            </Col>
        </Row>
    </Panel>;
}
