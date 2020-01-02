import React from "react";

import * as PropTypes from "prop-types";

import { Table } from "components/ui";

const ColumnTimeAverageTable = ({ data }) =>
    <Table data={data}
           rows={[
               {
                   label: "Coluna",
                   value: "columnName"
               },
               {
                   label: "Lead Time",
                   value: it => it.averageTime.toFixed(2)
               },
           ]}
           emptyMessage="Nenhuma informação encontrada."/>;

ColumnTimeAverageTable.propTypes = {
    data: PropTypes.array
};

export default ColumnTimeAverageTable;
