import React from "react";

import { SuggestInput } from "components";
import { InputField } from "components/ui";

export default ({ leadTimeConfig, errors, changeValue, suggestions }) => <>
    <InputField s={12}
                name="name"
                label="Nome"
                onChange={e => changeValue("name", e.target.value)}
                value={leadTimeConfig.name}
                errors={errors["name"]}/>

    <SuggestInput s={12}
                  name="startColumn"
                  label="Coluna inicial"
                  changeValue={changeValue}
                  value={leadTimeConfig.startColumn}
                  suggestions={suggestions}
                  errors={errors["startColumn"]}/>

    <SuggestInput s={12}
                  name="endColumn"
                  label="Coluna final"
                  changeValue={changeValue}
                  value={leadTimeConfig.endColumn}
                  suggestions={suggestions}
                  errors={errors["endColumn"]}/>
</>;
