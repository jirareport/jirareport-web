import React from "react";

import { Panel, InputField, Row } from "components/ui";
import { MultipleSuggestInput, SuggestInput } from "components";

export default ({ loading, board, statuses, changeValue, errors }) =>
    <Panel collapsible
           wrapper="div"
           title="Configurações Básicas"
           loading={loading}>
        <Row>
            <InputField s={12}
                        name="name"
                        label="Nome"
                        onChange={e => changeValue("name", e.target.value)}
                        value={board.name || ""}
                        errors={errors["name"]}/>

            <SuggestInput s={12}
                          name="startColumn"
                          label="Coluna Inicial"
                          changeValue={changeValue}
                          value={board.startColumn}
                          suggestions={statuses}/>

            <SuggestInput s={12}
                          name="endColumn"
                          label="Coluna Final"
                          changeValue={changeValue}
                          value={board.endColumn}
                          suggestions={statuses}/>

            <MultipleSuggestInput s={12}
                                  name="fluxColumn"
                                  label="Fluxo Ordenado De Colunas"
                                  changeValue={changeValue}
                                  value={board.fluxColumn}
                                  suggestions={statuses}/>
        </Row>
    </Panel>;
