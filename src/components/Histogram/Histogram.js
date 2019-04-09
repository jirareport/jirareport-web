import React from "react";

import { Chart } from "components";

import "./style.scss";

export default ({ data, loading }) =>
    <Chart beginAtZero
           chartType="bar"
           title="Histograma"
           key="histogram-chart"
           loading={loading}
           data={data.chart}>
        <div className="histogram__percentiles">
            <h5>Mediana: {data.median}</h5>
            <h5>Percentil 75: {data.percentile75}</h5>
            <h5>Percentil 90: {data.percentile90}</h5>
        </div>
    </Chart>;
