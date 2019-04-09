import React from "react";

import * as PropTypes from "prop-types";

import { Table } from "components/ui";

const AvgColumnTimeTable = ({ columnTimeAvg }) =>
    <Table data={columnTimeAvg}
           rows={[
               {
                   label: "Coluna",
                   value: "columnName"
               },
               {
                   label: "Lead Time",
                   value: it => it.avgTime.toFixed(2)
               },
           ]}
           emptyMessage="Nenhuma informação encontrada."/>;

AvgColumnTimeTable.propTypes = {
    columnTimeAvg: PropTypes.array
};

export default AvgColumnTimeTable;
