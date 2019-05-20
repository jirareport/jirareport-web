import React from "react";
import * as PropTypes from "prop-types";
import { Table } from "components/ui";

const ImpedimentHistoryTable = ({ impedimentHistory }) =>
    <Table data={impedimentHistory}
           rows={[
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

ImpedimentHistoryTable.propTypes = {
    impedimentHistory: PropTypes.array
};

export default ImpedimentHistoryTable;
