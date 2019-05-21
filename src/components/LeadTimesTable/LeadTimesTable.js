import React from "react";

import PropTypes from "prop-types";

import { Table } from "components/ui";

const LeadTimesTable = ({ leadTimes }) =>
    <Table data={leadTimes}
           rows={[
               {
                   label: "Nome",
                   value: "name"
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
           ]}/>;

LeadTimesTable.propTypes = {
    leadTimes: PropTypes.array.isRequired
};

export default LeadTimesTable;
