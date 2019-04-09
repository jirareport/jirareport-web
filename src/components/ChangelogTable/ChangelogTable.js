import { Table } from "components/ui";
import * as PropTypes from "prop-types";
import React from "react";

const ChangelogTable = ({ changelog }) =>
    <Table data={changelog}
           rows={[
               {
                   label: "Coluna",
                   value: "to"
               },
               {
                   label: "Início",
                   value: "startDate"
               },
               {
                   label: "Fim",
                   value: "endDate"
               },
               {
                   label: "Lead Time",
                   value: "leadTime"
               }
           ]}
           emptyMessage="Nenhuma informação encontrada."/>;

ChangelogTable.propTypes = {
    changelog: PropTypes.array
};

export default ChangelogTable;
