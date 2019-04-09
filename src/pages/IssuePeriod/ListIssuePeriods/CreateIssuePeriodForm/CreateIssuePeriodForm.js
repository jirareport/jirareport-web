import React from "react";

import { Button, Col, DatePicker, Panel, Row } from "components/ui";

export default ({ handleSubmit, errors, issuePeriod, isLoading, changeValue }) =>
    <Panel collapsible defaultClose title="Novo Período" actions={
        <Button onClick={handleSubmit} disabled={isLoading}>Inserir período</Button>
    }>
        <Row>
            <Col s={12} l={6}>
                <DatePicker name="startDate"
                            value={issuePeriod.startDate}
                            changeValue={changeValue}
                            label="Data inicial"
                            errors={errors["startDate"]}/>
            </Col>
            <Col s={12} l={6}>
                <DatePicker name="endDate"
                            value={issuePeriod.endDate}
                            changeValue={changeValue}
                            label="Data final"
                            errors={errors["endDate"]}/>
            </Col>
        </Row>
    </Panel>;
