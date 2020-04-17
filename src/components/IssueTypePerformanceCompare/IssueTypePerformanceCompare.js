import React from "react";

import validations from "validators/validations";
import { Panel } from "components/ui";
import { Chart } from "components/index";

const EmptyIssueTypePerformanceCompare = ({ loading }) =>
    <Panel wrapper="div" title="Performance Por Tipo" loading={loading}>
        <div className="center-align">
            <h5>Nenhuma informação encontrada.</h5>
        </div>
    </Panel>;

const IssueTypePerformanceCompareCharts = ({ data, loading }) => <>
    {Object.keys(data).map(issueType =>
        <Chart loading={loading}
               multiAxis
               beginAtZero
               title={`Performance Por ${issueType}`}
               key={`throughput-by-estimate-chart-${issueType}`}
               data={data[issueType]}/>
    )};
</>;

const IssueTypePerformanceCompare = ({ loading, data }) =>
    validations.isEmptyObject(data) ?
        <EmptyIssueTypePerformanceCompare loading={loading}/> :
        <IssueTypePerformanceCompareCharts data={data} loading={loading}/>;

export default IssueTypePerformanceCompare;
