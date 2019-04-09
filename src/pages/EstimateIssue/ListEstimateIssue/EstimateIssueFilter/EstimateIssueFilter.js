import React from "react";

import Panel from "components/ui/Panel/Panel";
import { Button, Col, DatePicker, Row } from "components/ui";
import Select from "components/ui/Select/Select";

const EstimateIssueFilter = ({ leadTimeFilter, board, loading, errors, changeValue, handleFilter }) =>
    <Panel title="Filtro de Lead Time" collapsible actions={
        <Button onClick={handleFilter} disabled={loading}>Calcular</Button>
    }>
        <Row>
            <Col s={12} l={4}>
                <DatePicker name="startDate"
                            value={leadTimeFilter.startDate}
                            changeValue={changeValue}
                            label="Data Inicial"
                            errors={errors["startDate"]}/>
            </Col>
            <Col s={12} l={4}>
                <DatePicker name="endDate"
                            value={leadTimeFilter.endDate}
                            changeValue={changeValue}
                            label="Data Final"
                            errors={errors["endDate"]}/>
            </Col>
            <Col s={12} l={4}>
                <Col s={12}>
                    <Select withoutWrapper
                            value={leadTimeFilter.field}
                            label="Campo De Filtro"
                            onChange={selected => changeValue("field", (selected || {}).value)}
                            options={[
                                {
                                    label: "Tipo",
                                    value: "ISSUE_TYPE"
                                },
                                ...(board.feature.system ? [{
                                    label: "Sistema",
                                    value: "SYSTEM"
                                }] : []),
                                ...(board.feature.estimate ? [{
                                    label: "Estimativa",
                                    value: "ESTIMATE"
                                }] : []),
                                ...(board.feature.epic ? [{
                                    label: "Épico",
                                    value: "EPIC"
                                }] : []),
                                ...(board.feature.project ? [{
                                    label: "Projeto",
                                    value: "PROJECT"
                                }] : []),
                                {
                                    label: "Prioridade",
                                    value: "PRIORITY"
                                }
                            ]}
                            errors={errors["field"]}/>
                </Col>
            </Col>
        </Row>
    </Panel>;

export default EstimateIssueFilter;
