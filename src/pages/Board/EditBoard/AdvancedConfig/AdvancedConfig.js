import React from "react";

import { MultipleSuggestInput } from "components";
import { Checkbox, Col, Panel, Select } from "components/ui";

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

    </Panel>;
