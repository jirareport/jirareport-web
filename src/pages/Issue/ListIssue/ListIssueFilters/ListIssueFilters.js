import React from "react";

import { Button, Col, DatePicker, Panel, Row, Select } from "components/ui";

const ListIssueFilters = ({ issueFilter, board, filters, filterKeys, changeValue, handleFilter, errors, isLoading }) =>
    <Col s={12}>
        <Panel title="Filtro" collapsible actions={
            <Button onClick={handleFilter} disabled={isLoading}>Filtrar</Button>
        }>
            <Row>
                <Col s={12} l={6}>
                    <DatePicker name="startDate"
                                value={issueFilter.startDate}
                                changeValue={changeValue}
                                label="Data Inicial"
                                errors={errors["startDate"]}/>
                </Col>
                <Col s={12} l={6}>
                    <DatePicker name="endDate"
                                value={issueFilter.endDate}
                                changeValue={changeValue}
                                label="Data Final"
                                errors={errors["endDate"]}/>
                </Col>

                {filterKeys.length > 0 && <Col s={12} l={6}>
                    <Select isMulti
                            disableLoadingWhenEmpty
                            withoutWrapper
                            options={filterKeys}
                            label="Keys Excluidas"
                            onChange={selected => changeValue("keys", selected.map(s => s.value))}
                            value={issueFilter.keys}/>
                </Col>}

                <Col s={12} l={6}>
                    <Select isMulti
                            disableLoadingWhenEmpty
                            withoutWrapper
                            options={filters.issueTypes.map(it => ({
                                label: it,
                                value: it
                            }))}
                            label="Tipo"
                            onChange={selected => changeValue("issueTypes", selected.map(s => s.value))}
                            value={issueFilter.issueTypes}/>
                </Col>

                <Col s={12} l={6}>
                    <Select isMulti
                            disableLoadingWhenEmpty
                            withoutWrapper
                            options={filters.priorities.map(it => ({
                                label: it,
                                value: it
                            }))}
                            label="Prioridade"
                            onChange={selected => changeValue("priorities", selected.map(s => s.value))}
                            value={issueFilter.priorities}/>
                </Col>

                {board.feature.estimate && <Col s={12} l={6}>
                    <Select isMulti
                            disableLoadingWhenEmpty
                            withoutWrapper
                            options={filters.estimates.map(it => ({
                                label: it,
                                value: it
                            }))}
                            label="Estimativa"
                            onChange={selected => changeValue("estimates", selected.map(s => s.value))}
                            value={issueFilter.estimates}/>
                </Col>}

                {board.feature.system && <Col s={12} l={6}>
                    <Select isMulti
                            disableLoadingWhenEmpty
                            withoutWrapper
                            options={filters.systems.map(it => ({
                                label: it,
                                value: it
                            }))}
                            label="Sistema"
                            onChange={selected => changeValue("systems", selected.map(s => s.value))}
                            value={issueFilter.systems}/>
                </Col>}

                {board.feature.project && <Col s={12} l={6}>
                    <Select isMulti
                            disableLoadingWhenEmpty
                            withoutWrapper
                            options={filters.projects.map(it => ({
                                label: it,
                                value: it
                            }))}
                            label="Projetos"
                            onChange={selected => changeValue("projects", selected.map(s => s.value))}
                            value={issueFilter.projects}/>
                </Col>}

                {board.feature.epic && <Col s={12} l={6}>
                    <Select isMulti
                            disableLoadingWhenEmpty
                            withoutWrapper
                            options={filters.epics.map(it => ({
                                label: it,
                                value: it
                            }))}
                            label="Épico"
                            onChange={selected => changeValue("epics", selected.map(s => s.value))}
                            value={issueFilter.epics}/>
                </Col>}

                {board.feature.dynamicField && filters.dynamicFieldsValues.map(df => <Col s={12} l={6} key={df.field}>
                    <Select isMulti
                            disableLoadingWhenEmpty
                            withoutWrapper
                            options={df.values.map(it => ({
                                label: it,
                                value: it
                            }))}
                            label={df.field}
                            onChange={selected => changeValue(df.field, selected.map(s => s.value))}
                            value={issueFilter[df.field]}/>
                </Col>)}

            </Row>
        </Panel>
    </Col>;

export default ListIssueFilters;
