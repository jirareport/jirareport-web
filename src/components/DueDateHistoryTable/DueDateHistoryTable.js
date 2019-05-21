import React from "react";

import PropTypes from "prop-types";

import { Table } from "components/ui";

const DueDateHistoryTable = ({ dueDateHistory }) =>
    <Table data={dueDateHistory}
           rows={[
               {
                   label: "Data de Atualização",
                   value: "created"
               },
               {
                   label: "Due Date",
                   value: "dueDate"
               }
           ]}
           emptyMessage="Nenhuma informação encontrada."/>;

DueDateHistoryTable.propTypes = {
    dueDateHistory: PropTypes.array.isRequired
};

export default DueDateHistoryTable;
