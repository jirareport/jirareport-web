import React from "react";

import { MultipleSuggestInput } from "components";
import { Checkbox, Col, InputField, Panel, Row, Select } from "components/ui";

export default ({ loading, board, issueTypes, changeValue, customFields, statuses }) =>
    <Panel collapsible
           defaultClose
           wrapper="div"
           title="Configurações Avançadas"
           loading={loading}>
        <MultipleSuggestInput s={12}
                              keepCase
                              name="ignoreIssueType"
                              label="Tipos De Issues à Serem Ignorados"
                              changeValue={changeValue}
                              value={board.ignoreIssueType}
                              suggestions={issueTypes}/>

        <Col s={12}>
            <Select value={board.epicCF}
                    label="Campo De Épico"
                    onChange={selected => changeValue("epicCF", (selected || {}).value)}
                    options={customFields}/>
        </Col>

        <Col s={12}>
            <Select value={board.estimateCF}
                    label="Campo De Estimativa"
                    onChange={selected => changeValue("estimateCF", (selected || {}).value)}
                    options={customFields}/>
        </Col>

        <Col s={12}>
            <Select value={board.systemCF}
                    label="Campo De Sistemas"
                    onChange={selected => changeValue("systemCF", (selected || {}).value)}
                    options={customFields}/>
        </Col>

        <Col s={12}>
            <Select value={board.projectCF}
                    label="Campo De Projeto"
                    onChange={selected => changeValue("projectCF", (selected || {}).value)}
                    options={customFields}/>
        </Col>

        <Col s={12}>
            <Select value={board.dueDateCF}
                    label="Campo De Due Date"
                    onChange={selected => changeValue("dueDateCF", (selected || {}).value)}
                    options={customFields}/>
        </Col>

        <Col s={12}>
            <Select value={board.dueDateType}
                    label="Tipo De Cálculo Para Desvio De Estimativa"
                    onChange={selected => changeValue("dueDateType", (selected || {}).value)}
                    options={[
                        {
                            label: "Calcula a diferença entre o primeiro e o último dueDate",
                            value: "FIRST_AND_LAST_DUE_DATE"
                        },
                        {
                            label: "Calcula a diferença entre a primeira dueDate e a data de entrega",
                            value: "FIRST_DUE_DATE_AND_END_DATE"
                        },
                        {
                            label: "Calcula a diferença entre a última dueDate e a data de entrega",
                            value: "LAST_DUE_DATE_AND_END_DATE"
                        }
                    ]}/>
        </Col>

        <Col s={12}>
            <Checkbox label="Conta Lead Time Como Dias Corridos?"
                      value={board.ignoreWeekend}
                      name="ignoreWeekend"
                      onChange={e => changeValue("ignoreWeekend", e.target.checked)}/>
        </Col>

        <Col s={12}>
            <Checkbox label="Usa a última ocorrência ao calcular o Lead Time?"
                      value={board.useLastOccurrenceWhenCalculateLeadTime}
                      name="useLastOccurrenceWhenCalculateLeadTime"
                      onChange={e => changeValue("useLastOccurrenceWhenCalculateLeadTime", e.target.checked)}/>
        </Col>


        <Col s={12}>
            <Select value={board.impedimentType}
                    label="Tipo De Impedimento"
                    onChange={selected => changeValue("impedimentType", (selected || {}).value)}
                    options={[
                        {
                            label: "Coluna",
                            value: "COLUMN"
                        },
                        {
                            label: "Flag",
                            value: "FLAG"
                        }
                    ]}/>
        </Col>

        {board.impedimentType === "COLUMN" && <MultipleSuggestInput s={12}
                                                                    name="impedimentColumns"
                                                                    label="Colunas Que Contam Impedimento"
                                                                    changeValue={changeValue}
                                                                    value={board.impedimentColumns}
                                                                    suggestions={statuses}/>}

        <MultipleSuggestInput s={12}
                              name="touchingColumns"
                              label="Colunas De Trabalho"
                              changeValue={changeValue}
                              value={board.touchingColumns}
                              suggestions={statuses}/>

        <MultipleSuggestInput s={12}
                              name="waitingColumns"
                              label="Colunas De Espera"
                              changeValue={changeValue}
                              value={board.waitingColumns}
                              suggestions={statuses}/>

        <Col s={12}>
            <Select value={board.issuePeriodNameFormat}
                    label="Nomenclatura para períodos mensais"
                    onChange={selected => changeValue("issuePeriodNameFormat", (selected || {}).value)}
                    options={[
                        {
                            label: "[Data inicial - Data Final]. Ex: [01/01/2020 - 31/01/2020]",
                            value: "INITIAL_AND_FINAL_DATE"
                        },
                        {
                            label: "Nome do mês. small. Ex: Janeiro",
                            value: "MONTH"
                        },
                        {
                            label: "Nome do mês / Ano. Ex: Janeiro/2020",
                            value: "MONTH_AND_YEAR"
                        },
                        {
                            label: "Nome do mês / Ano abreviado. Ex: Janeiro/20",
                            value: "MONTH_AND_ABBREVIATED_YEAR"
                        },
                        {
                            label: "Nome do mês abreviado. Ex: Jan",
                            value: "ABBREVIATED_MONTH"
                        },
                        {
                            label: "Nome do mês abreviado / Ano. Ex: Jan/2020",
                            value: "ABBREVIATED_MONTH_AND_YEAR"
                        },
                        {
                            label: "Nome do mês abreviado / Ano abreviado. Ex: Jan/20",
                            value: "ABBREVIATED_MONTH_AND_ABBREVIATED_YEAR"
                        }
                    ]}/>
        </Col>
        <Col s={12}>
            <Row>
                <InputField s={12}
                            name="additionalFilter"
                            label="Filtro adicional"
                            onChange={e => changeValue("additionalFilter", e.target.value)}
                            value={board.additionalFilter || ""}/>
            </Row>
        </Col>
    </Panel>;
